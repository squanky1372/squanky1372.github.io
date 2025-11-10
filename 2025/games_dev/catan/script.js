/*
  Simplified Catan implementation:
  - Board: fixed 19-hex layout (axial coordinates) with randomized resources and numbers.
  - Intersections & edges generated. Click intersections to place settlement/city when allowed.
  - Roads placed between intersections.
  - Turn flow with dice roll, resource distribution, robber movement on 7.
  - Simple bank trades 4:1 only.
  - Pass-and-play local multiplayer (2-4 players).
*/

const SVG_NS = "http://www.w3.org/2000/svg";
const RESOURCES = ["wood","brick","sheep","wheat","ore","desert"];
const RESOURCE_COLORS = {wood:"#6aa84f", brick:"#b85a38", sheep:"#dbeaa7", wheat:"#f2d479", ore:"#9aa3b2", desert:"#e9d6b3"};
const NUMBER_TOKENS = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12]; // standard set (desert has none)
const RESOURCE_DISTR = {"wood":4,"brick":3,"sheep":4,"wheat":4,"ore":3,"desert":1};

let game = null;

function log(msg){
  const el = document.getElementById('log');
  const p = document.createElement('div');
  p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  el.prepend(p);
}

function randShuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

// Board geometry: use axial hex coordinates for a Catan layout radius 2
function generateHexCoords(){
  const coords=[];
  for(let q=-2;q<=2;q++){
    for(let r=-2;r<=2;r++){
      const s = -q - r;
      if(Math.abs(s) <= 2) coords.push({q,r,s});
    }
  }
  return coords; // 19
}

function hexToPixel(q, r, size = 60) {
  const x = size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
  const y = size * (3/2 * r) - 80;  // <--- shift the whole board up by 80 pixels
  return { x, y };
}


function polygonPoints(cx,cy,size, sides=6, rot=0){
  const pts=[];
  for(let i=0;i<sides;i++){
    const ang = 2*Math.PI*(i/sides) + rot;
    pts.push(`${(cx + size*Math.cos(ang)).toFixed(2)},${(cy + size*Math.sin(ang)).toFixed(2)}`);
  }
  return pts.join(' ');
}

// Build intersection graph: compute corners for each tile and assign unique intersection points.
// We'll treat intersections as exact floats but use string keys to dedupe.
function buildBoardModel(){
  const coords = generateHexCoords();
  const size = 60;
  const tiles = coords.map(c=>{
    const p = hexToPixel(c.q,c.r,size);
    return {q:c.q, r:c.r, s:c.s, x:p.x, y:p.y, size};
  });

  // generate resource list: create flat array of resource names by counts, shuffle
  let resources = [];
  for(const [k,v] of Object.entries(RESOURCE_DISTR)) for(let i=0;i<v;i++) resources.push(k);
  resources = randShuffle(resources);

  // number tokens fill for non-desert tiles
  let numTokens = randShuffle(NUMBER_TOKENS);

  tiles.forEach(t=>{
    t.resource = resources.pop();
    if(t.resource === 'desert'){ t.number = null; t.hasRobber = true; } 
    else t.number = numTokens.pop();
  });

  // build intersections: for each tile, compute 6 corner points
  const intersectionsMap = new Map();
  const edges = new Map();

  function keyFrom(x,y){ return `${x.toFixed(3)}_${y.toFixed(3)}`; }

  tiles.forEach((t,i)=>{
    const corners = [];
    for(let k=0;k<6;k++){
      const ang = Math.PI/6 + k*Math.PI/3; // flat-top orientation
      const cx = t.x + t.size * Math.cos(ang);
      const cy = t.y + t.size * Math.sin(ang);
      const key = keyFrom(cx,cy);
      if(!intersectionsMap.has(key)){
        intersectionsMap.set(key, {id:intersectionsMap.size, x:cx, y:cy, touches:[], built:null});
      }
      const node = intersectionsMap.get(key);
      node.touches.push(i);
      corners.push(node.id);
    }
    t.corners = corners;
    // add tile id reference to corner nodes
    t.id = i;
  });

  // build edges (between adjacent corner ids)
  tiles.forEach(t=>{
    for(let k=0;k<6;k++){
      const a = t.corners[k];
      const b = t.corners[(k+1)%6];
      const ekey = a<b ? `${a}_${b}` : `${b}_${a}`;
      if(!edges.has(ekey)) edges.set(ekey, {a,b,roads:[]});
      edges.get(ekey).tiles = edges.get(ekey).tiles || [];
      edges.get(ekey).tiles.push(t.id);
    }
  });

  const intersections = Array.from(intersectionsMap.values());
  const edgeList = Array.from(edges.values());
  return {tiles, intersections, edges: edgeList};
}

// Game state initialization
function newGame(playerCount=3){
  const model = buildBoardModel();
  const players = [];
  const colors = ['var(--player0)','var(--player1)','var(--player2)','var(--player3)'];
  for(let i=0;i<playerCount;i++){
    players.push({
      id:i, name:`Player ${i+1}`, color: colors[i], resources:{wood:0,brick:0,sheep:0,wheat:0,ore:0}, roads:[], settlements:[], cities:[], vp:0
    });
  }
  // bank resource counts (simplified unlimited)
  const state = {
    model,
    players,
    currentPlayer: 0,
    phase: "initialPlacement1", // initialPlacement1 -> initialPlacement2 -> play
    initialRoundIndex: 0, // which player to place
    startingPlacementOrder: Array.from({length:playerCount}, (_,i)=>i),
    diceRolledThisTurn: false,
    robberTile: model.tiles.find(t=>t.resource==='desert')?.id ?? 0,
    winner: null
  };
  // For initial placement: second round goes in reverse order
  state.placementSequence = state.startingPlacementOrder.concat(state.startingPlacementOrder.slice().reverse());
  // mark robber tile
  model.tiles.forEach(t=> t.id===state.robberTile ? t.hasRobber=true : t.hasRobber=false);
  game = state;
  render();
  log(`New game started with ${playerCount} players.`);
  writeUI();
}

// Utility checks for building rules (simplified: no distance rule for initial placement enforced)
function canPlaceSettlement(playerId, intersectionId){
  const node = game.model.intersections[intersectionId];
  if(node.built) return false;
  // must be adjacent to player's road OR it's initial placement (phase not 'play')
  if(game.phase.startsWith('initial')) return true;
  // adjacency to a road owned by player
  const edges = game.model.edges.filter(e=> e.a===intersectionId || e.b===intersectionId);
  for(const e of edges){
    if(e.owner === playerId) return true;
  }
  return false;
}

function canPlaceRoad(playerId, edgeKey){
  const edge = game.model.edges.find(e => e.a===edgeKey.a && e.b===edgeKey.b || e.a===edgeKey.b && e.b===edgeKey.a);
  // If already owned, no
  if(edge.owner !== undefined) return false;
  // must be connected to player's road or settlement/city
  const player = game.players[playerId];
  if(game.phase.startsWith('initial')) return true;
  if(player.settlements.some(s=> adjacentToEdge(s, edge) ) || player.cities.some(s=> adjacentToEdge(s, edge) )) return true;
  // if player's existing roads connect
  for(const r of player.roads){
    if(edgesAdjacent(r, edge)) return true;
  }
  return false;
}

function adjacentToEdge(intersectionId, edge){
  return edge.a===intersectionId || edge.b===intersectionId;
}

function edgesAdjacent(e1, e2){
  return e1.a===e2.a||e1.a===e2.b||e1.b===e2.a||e1.b===e2.b;
}

// Building costs
const COSTS = {
  road: {brick:1, wood:1},
  settlement: {brick:1, wood:1, sheep:1, wheat:1},
  city: {ore:3, wheat:2}
};

function hasResources(player, cost){
  for(const k in cost) if((player.resources[k]||0) < cost[k]) return false;
  return true;
}
function deductResources(player, cost){
  for(const k in cost) player.resources[k] -= cost[k];
}

// Game rendering (SVG)
function render(){
  const svg = document.getElementById('board');
  while(svg.firstChild) svg.removeChild(svg.firstChild);
  const gTiles = document.createElementNS(SVG_NS,'g');
  gTiles.setAttribute('transform','translate(0,0)');
  svg.appendChild(gTiles);

  const {tiles, intersections, edges} = game.model;

  // Draw tiles
  tiles.forEach(t=>{
    const pts = polygonPoints(t.x,t.y,t.size,6,Math.PI/6);
    const hex = document.createElementNS(SVG_NS,'polygon');
    hex.setAttribute('points', pts);
    hex.setAttribute('class','hex');
    hex.setAttribute('fill', RESOURCE_COLORS[t.resource] || '#ccc');
    gTiles.appendChild(hex);

    // number token
    if(t.number !== null){
      const circle = document.createElementNS(SVG_NS,'circle');
      circle.setAttribute('cx', t.x);
      circle.setAttribute('cy', t.y);
      circle.setAttribute('r', 22);
      circle.setAttribute('fill', t.number===6||t.number===8 ? '#f5b66b' : '#fff');
      circle.setAttribute('stroke','#071126');
      circle.setAttribute('stroke-width','2');
      gTiles.appendChild(circle);

      const text = document.createElementNS(SVG_NS,'text');
      text.setAttribute('x', t.x);
      text.setAttribute('y', t.y+2);
      text.setAttribute('class','tile-label');
      text.textContent = t.number;
      gTiles.appendChild(text);
    } else {
      // desert label
      const txt = document.createElementNS(SVG_NS,'text');
      txt.setAttribute('x', t.x);
      txt.setAttribute('y', t.y+4);
      txt.setAttribute('class','tile-label');
      txt.textContent = 'DESERT';
      gTiles.appendChild(txt);
    }

    // robber marker
    if(t.hasRobber){
      const r = document.createElementNS(SVG_NS,'circle');
      r.setAttribute('cx', t.x + t.size*0.28);
      r.setAttribute('cy', t.y - t.size*0.24);
      r.setAttribute('r', 12);
      r.setAttribute('fill','#222');
      r.setAttribute('stroke','#fff');
      r.setAttribute('stroke-width',1.5);
      gTiles.appendChild(r);
      const rt = document.createElementNS(SVG_NS,'text');
      rt.setAttribute('x', t.x + t.size*0.28);
      rt.setAttribute('y', t.y - t.size*0.24 + 4);
      rt.setAttribute('text-anchor','middle');
      rt.setAttribute('fill','#fff');
      rt.setAttribute('font-size','11');
      rt.textContent = 'R';
      gTiles.appendChild(rt);
    }
  });

  // Draw roads (edges)
  const roadsGroup = document.createElementNS(SVG_NS,'g');
  roadsGroup.setAttribute('stroke-width', 10);
  svg.appendChild(roadsGroup);
  edges.forEach(e=>{
    const a = game.model.intersections[e.a];
    const b = game.model.intersections[e.b];
    const line = document.createElementNS(SVG_NS,'line');
    line.setAttribute('x1', a.x);
    line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x);
    line.setAttribute('y2', b.y);
    line.setAttribute('class','road');
    line.setAttribute('stroke', e.owner !== undefined ? game.players[e.owner].color : 'transparent');
    line.setAttribute('stroke-width', e.owner !== undefined ? 8 : 3);
    line.setAttribute('opacity', e.owner !== undefined ? 1 : 0.15);
    line.addEventListener('click', (ev)=> onEdgeClick(e));
    roadsGroup.appendChild(line);
    e._line = line;
  });

  // Draw intersections
  const nodesGroup = document.createElementNS(SVG_NS,'g');
  svg.appendChild(nodesGroup);
  intersections.forEach(n=>{
    const circ = document.createElementNS(SVG_NS,'circle');
    circ.setAttribute('cx', n.x);
    circ.setAttribute('cy', n.y);
    circ.setAttribute('r', 12);
    circ.setAttribute('class','intersection');
    circ.setAttribute('stroke','#071126');
    circ.setAttribute('stroke-width',1.5);
    circ.setAttribute('fill', n.built ? (n.built.type === 'city' ? '#fff' : game.players[n.built.player].color) : 'transparent');
    circ.setAttribute('opacity', n.built ? 1 : 0.4);
    circ.addEventListener('click', ()=> onIntersectionClick(n));
    nodesGroup.appendChild(circ);
    // store references for update
    n._circ = circ;
    // if built, overlay text
    if(n.built){
      const t = document.createElementNS(SVG_NS,'text');
      t.setAttribute('x', n.x);
      t.setAttribute('y', n.y+4);
      t.setAttribute('text-anchor','middle');
      t.setAttribute('fill','#071126');
      t.setAttribute('font-size','11');
      t.textContent = n.built.type[0].toUpperCase();
      nodesGroup.appendChild(t);
    }
  });

  // labels/instructions for intersections' availability
  writeUI();
}

// UI writing
function writeUI(){
  // players list
  const pdiv = document.getElementById('players');
  pdiv.innerHTML = '';
  game.players.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'player' + (game.currentPlayer===p.id ? ' active' : '');
    el.style.borderLeft = `6px solid ${p.color}`;
    const name = document.createElement('div');
    name.textContent = `${p.name} — ${p.vp} VP`;
    name.style.fontWeight='700';
    el.appendChild(name);
    const resRow = document.createElement('div');
    resRow.className = 'res-list';
    for(const r of ['wood','brick','sheep','wheat','ore']){
      const rEl = document.createElement('div');
      rEl.className='res';
      rEl.textContent = `${r[0].toUpperCase()}: ${p.resources[r]||0}`;
      resRow.appendChild(rEl);
    }
    el.appendChild(resRow);
    pdiv.appendChild(el);
  });

  document.getElementById('turnIndicator').textContent = game.players[game.currentPlayer].name;
  document.getElementById('diceResult').textContent = game.diceRolledThisTurn ? game.lastDice : '—';
  document.getElementById('robberOn').textContent = game.model.tiles[game.robberTile].resource.toUpperCase();
}

// Dice roll and distribution
function rollDice(){
  if(game.phase.startsWith('initial')){ log("Can't roll during initial placement."); return; }
  if(game.diceRolledThisTurn){ log("Dice already rolled this turn."); return; }
  const d1 = 1 + Math.floor(Math.random()*6);
  const d2 = 1 + Math.floor(Math.random()*6);
  const total = d1 + d2;
  game.diceRolledThisTurn = true;
  game.lastDice = total;
  document.getElementById('diceResult').textContent = total;
  log(`${game.players[game.currentPlayer].name} rolled ${d1} + ${d2} = ${total}`);

  if(total === 7){
    // robber — steal: each player with >7 resource should discard half (not implemented fully: warn)
    // We'll allow active player to move robber tile by clicking a tile
    log("Robber! Click a tile with a number to move the robber and steal from a player with a settlement adjacent.");
    // enter robber move mode
    enterMode({type:'moveRobber'});
    return;
  }

  // distribute resources for tiles with that number and not blocked by robber
  let distributed=false;
  game.model.tiles.forEach(tile=>{
    if(tile.number === total && !tile.hasRobber){
      // for each adjacent intersection with settlement/city, grant resources
      tile.corners.forEach(cId=>{
        const node = game.model.intersections[cId];
        if(node.built){
          const owner = node.built.player;
          const amount = node.built.type === 'city' ? 2 : 1;
          game.players[owner].resources[tile.resource] = (game.players[owner].resources[tile.resource]||0) + amount;
          distributed=true;
          log(`${game.players[owner].name} receives ${amount} ${tile.resource} from tile ${tile.number}`);
        }
      });
    }
  });
  if(!distributed) log("No resources produced.");
  writeUI();
}

// Mode handling (for moves like building)
let mode = {type:'normal'}; // or {type:'buildSettlement'} etc.
function enterMode(m){
  mode = m || {type:'normal'};
  document.getElementById('mode').textContent = mode.type;
}

function onIntersectionClick(node){
  const player = game.players[game.currentPlayer];
  if(mode.type === 'initialPlacement'){
    // place settlement for initial
    if(!canPlaceSettlement(game.currentPlayer, node.id)){ log("Can't place settlement here."); return; }
    node.built = {player: game.currentPlayer, type:'settlement'};
    player.settlements.push(node.id);
    player.vp += 1;
    log(`${player.name} placed starting settlement at intersection ${node.id}`);
    // auto-place nothing else (roads not placed automatically). In real Catan, a free adjacent road is expected; skip for brevity
    // next placement
    advanceInitialPlacement();
    render();
    return;
  }

  if(mode.type === 'moveRobber' && node){
    // find adjacent tile to clicked node? For simplicity, we'll move robber to a tile adjacent to clicked intersection if available
    const adjacentTileIds = node.touches;
    if(adjacentTileIds.length === 0){ log("That intersection touches no tiles?"); enterMode({type:'normal'}); return; }
    // pick first tile that is not same as current robber location
    const newTileId = adjacentTileIds.find(tid=> tid !== game.robberTile) ?? adjacentTileIds[0];
    // move robber
    game.model.tiles[game.robberTile].hasRobber = false;
    game.robberTile = newTileId;
    game.model.tiles[game.robberTile].hasRobber = true;
    log(`${game.players[game.currentPlayer].name} moved the robber to tile ${game.model.tiles[game.robberTile].resource} (${game.model.tiles[game.robberTile].number || 'DESERT'})`);
    // steal: find opponents with settlement/city adjacent and randomly steal 1 resource
    const victims = new Set();
    game.model.tiles[game.robberTile].corners.forEach(c=>{
      const n = game.model.intersections[c];
      if(n.built && n.built.player !== game.currentPlayer) victims.add(n.built.player);
    });
    if(victims.size){
      const arr = Array.from(victims);
      const victimId = arr[Math.floor(Math.random()*arr.length)];
      const victim = game.players[victimId];
      // pick random non-zero resource
      const available = Object.entries(victim.resources).filter(([k,v])=>v>0);
      if(available.length){
        const choice = available[Math.floor(Math.random()*available.length)];
        const res = choice[0];
        victim.resources[res]--;
        game.players[game.currentPlayer].resources[res] = (game.players[game.currentPlayer].resources[res]||0) + 1;
        log(`${game.players[game.currentPlayer].name} stole 1 ${res} from ${victim.name}`);
      } else log(`${victim.name} had no resources to steal.`);
    } else log("No adjacent opponents to steal from.");
    enterMode({type:'normal'});
    render();
    return;
  }

  if(mode.type === 'buildSettlement'){
    if(!canPlaceSettlement(game.currentPlayer, node.id)){ log("Can't place settlement here."); return; }
    const player = game.players[game.currentPlayer];
    if(game.phase.startsWith('initial')){
      // free
      node.built = {player: player.id, type:'settlement'};
      player.settlements.push(node.id);
      player.vp += 1;
      log(`${player.name} placed a starting settlement.`);
      advanceInitialPlacement();
      render();
      return;
    }
    // normal purchase cost
    if(!hasResources(player, COSTS.settlement)){ log("Not enough resources for settlement."); return; }
    deductResources(player, COSTS.settlement);
    node.built = {player: player.id, type:'settlement'};
    player.settlements.push(node.id);
    player.vp += 1;
    log(`${player.name} built a settlement.`);
    enterMode({type:'normal'});
    render();
    checkVictory();
    return;
  }

  if(mode.type === 'upgradeCity'){
    // upgrade a settlement owned by player at this node into a city
    if(!node.built || node.built.player !== game.currentPlayer || node.built.type !== 'settlement'){ log("No settlement of yours here to upgrade."); return; }
    const player = game.players[game.currentPlayer];
    if(!hasResources(player, COSTS.city)){ log("Not enough resources for city."); return; }
    deductResources(player, COSTS.city);
    node.built.type = 'city';
    // move settlement id to city list
    player.settlements = player.settlements.filter(s=> s !== node.id);
    player.cities.push(node.id);
    player.vp += 1; // settlement 1 -> city 2 so +1 more point
    log(`${player.name} upgraded a settlement to a city.`);
    enterMode({type:'normal'});
    render();
    checkVictory();
    return;
  }

  // default: show info or attempt to place road if in road mode
  if(mode.type === 'buildRoad'){
    // selecting an intersection picks one endpoint; we allow clicking an edge by clicking near midpoint rather than intersection — simpler: detect nearest edge
    log("To place a road, click a road segment (line).");
    return;
  }
}

function onEdgeClick(edge){
  // either build road if in buildRoad mode, or show info
  if(mode.type === 'buildRoad'){
    const player = game.players[game.currentPlayer];
    // find the edge object in model.edges by identity
    const eobj = edge;
    // if already owned
    if(eobj.owner !== undefined){ log("Edge already has a road."); return; }
    // check adjacency
    // simplify: allow placement next to player's settlement/city or existing road
    const allowed = player.settlements.some(s=>s===eobj.a || s===eobj.b) || player.cities.some(s=>s===eobj.a || s===eobj.b) || player.roads.some(r=> edgesAdjacent(r, eobj));
    if(game.phase.startsWith('initial')) {
      // in initial placement, place road freely adjacent to your settlement
      const intersectsOwn = (player.settlements.some(s=>s===eobj.a) || player.settlements.some(s=>s===eobj.b));
      if(!intersectsOwn) { log("Initial road must be adjacent to your starting settlement."); return; }
      eobj.owner = player.id;
      player.roads.push({a:eobj.a,b:eobj.b});
      log(`${player.name} placed starting road.`);
      advanceInitialPlacement();
      render();
      return;
    }
    if(!allowed){ log("Road must connect to your road or settlement."); return; }
    if(!hasResources(player, COSTS.road)){ log("Not enough resources to build road."); return; }
    deductResources(player, COSTS.road);
    eobj.owner = player.id;
    player.roads.push({a:eobj.a,b:eobj.b});
    log(`${player.name} built a road.`);
    enterMode({type:'normal'});
    render();
    return;
  } else {
    // show who owns it
    if(edge.owner !== undefined) log(`Road owned by ${game.players[edge.owner].name}`);
    else log("Empty road segment. Enter Build Road mode to place a road.");
  }
}

// End turn
function endTurn(){
  // reset dice rolled flag, switch player, check if entering play phase after initial placement
  game.diceRolledThisTurn = false;
  // advance currentPlayer index
  game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
  // if initial placement phase and we used placementSequence and it's done, switch to 'play' mode
  if(game.phase.startsWith('initial')){
    // if placementSequence finished, switch to play
    if(game.placementSequenceDone){
      game.phase = 'play';
      log("Initial placement complete. Game enters normal play.");
    } else {
      // if next player's turn in initial placement, set currentPlayer accordingly
      // place according to placementSequence pointer (we manage placement sequence in advanceInitialPlacement)
    }
  }
  enterMode({type:'normal'});
  render();
  log(`Turn passed to ${game.players[game.currentPlayer].name}`);
}

// Advance initial placement sequence internal
function advanceInitialPlacement(){
  // we will pop from placementSequence
  if(!game._placementIndex) game._placementIndex = 0;
  game._placementIndex++;
  if(game._placementIndex >= game.placementSequence.length){
    game.placementSequenceDone = true;
    game.phase = 'play';
    // set current player to player 0 (or next in rotation)
    game.currentPlayer = 0;
    log("Initial placement finished. Starting normal play with Player 1.");
    render();
    return;
  }
  // set current player to next in sequence
  game.currentPlayer = game.placementSequence[game._placementIndex];
  log(`Initial placement: ${game.players[game.currentPlayer].name}'s turn to place.`);
  render();
}

// Bank trade 4:1: choose resource to give and receive (simple prompt-based)
function bankTrade(){
  const player = game.players[game.currentPlayer];
  const give = prompt("Give which resource (wood,brick,sheep,wheat,ore)?");
  if(!give || !(give in player.resources)) { log("Trade canceled or invalid resource."); return; }
  if((player.resources[give]||0) < 4){ log("Not enough to trade 4:1."); return; }
  const receive = prompt("Receive which resource (wood,brick,sheep,wheat,ore)?");
  if(!receive) { log("Trade canceled."); return; }
  player.resources[give] -= 4;
  player.resources[receive] = (player.resources[receive]||0) + 1;
  log(`${player.name} traded 4 ${give} for 1 ${receive} with bank.`);
  writeUI();
}

// Check victory
function checkVictory(){
  const p = game.players[game.currentPlayer];
  if(p.vp >= 10){
    game.winner = p.id;
    log(`${p.name} reaches ${p.vp} VP and wins the game!`);
    alert(`${p.name} wins!`);
  }
}

// UI wiring
document.getElementById('newGame').addEventListener('click', ()=>{
  const cnt = parseInt(document.getElementById('playerCount').value,10);
  newGame(cnt);
});
document.getElementById('rollBtn').addEventListener('click', ()=> rollDice());
document.getElementById('buildSettlement').addEventListener('click', ()=> enterMode({type:'buildSettlement'}));
document.getElementById('buildRoad').addEventListener('click', ()=> enterMode({type:'buildRoad'}));
document.getElementById('upgradeCity').addEventListener('click', ()=> enterMode({type:'upgradeCity'}));
document.getElementById('bankTrade').addEventListener('click', ()=> bankTrade());
document.getElementById('endTurn').addEventListener('click', ()=> { endTurn(); });
document.getElementById('clearLog').addEventListener('click', ()=> { document.getElementById('log').innerHTML=''; });

document.getElementById('board').addEventListener('click', (ev)=>{
  // if click on tile territory (to move robber)
  if(mode.type === 'moveRobber'){
    // find nearest tile to click point
    const pt = screenToSvgPoint(ev);
    const tiles = game.model.tiles;
    let best = null; let bestD = 1e9;
    tiles.forEach(t=>{
      const dx = pt.x - t.x; const dy = pt.y - t.y; const d = Math.hypot(dx,dy);
      if(d < bestD){ bestD=d; best=t; }
    });
    if(best && best.id !== game.robberTile){
      game.model.tiles[game.robberTile].hasRobber=false;
      game.robberTile = best.id;
      game.model.tiles[game.robberTile].hasRobber=true;
      log(`Robber moved to tile ${best.resource} (${best.number || 'DESERT'})`);
      // attempt steal (same logic as earlier)
      const victims = new Set();
      game.model.tiles[game.robberTile].corners.forEach(c=>{
        const n = game.model.intersections[c];
        if(n.built && n.built.player !== game.currentPlayer) victims.add(n.built.player);
      });
      if(victims.size){
        const arr = Array.from(victims);
        const victimId = arr[Math.floor(Math.random()*arr.length)];
        const victim = game.players[victimId];
        const available = Object.entries(victim.resources).filter(([k,v])=>v>0);
        if(available.length){
          const choice = available[Math.floor(Math.random()*available.length)];
          const res = choice[0];
          victim.resources[res]--;
          game.players[game.currentPlayer].resources[res] = (game.players[game.currentPlayer].resources[res]||0) + 1;
          log(`${game.players[game.currentPlayer].name} stole 1 ${res} from ${victim.name}`);
        } else log(`${victim.name} had no resources to steal.`);
      } else log("No adjacent opponents to steal from.");
      enterMode({type:'normal'});
      render();
    } else {
      log("Robber must be moved to a different tile.");
    }
  }
});

function screenToSvgPoint(ev){
  const svg = document.getElementById('board');
  const pt = svg.createSVGPoint();
  pt.x = ev.clientX; pt.y = ev.clientY;
  const ctm = svg.getScreenCTM().inverse();
  const sp = pt.matrixTransform(ctm);
  return {x: sp.x, y: sp.y};
}

// Start default
newGame(3);