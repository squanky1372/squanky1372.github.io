fetch('./data.json')
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        weekly_data = json
});

var project_data = null
    fetch('./projects.json')
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        project_data = json
});

var weekly_data = null

function outerFunction(terminal){
    terminal.echo("outer space!")
}

function weekly(terminal){
    weekly_data.forEach((event, i) => {
        terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">========================================================================================`, {raw:true})
        terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">
            Week ${event.Week}: Project ${event.Project_Number} - ${event.Project_Name}
        <div>`, {raw:true})
        terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">========================================================================================`, {raw:true})
        terminal.echo(`
        <div style="font-size: 20px; padding: 0% 10% 00% 10%">
        ${event.Text}
        <div>`, {raw:true})
    })
}
function projects(terminal){
    //list all project names and numbers, pulling from the second json file
    project_data.forEach((event, i) => {
        terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">
                Project ${event.Project_Number} - ${event.Project_Name}
            <div>`, {raw:true})
    })
}
function project(terminal, project_number){
    project_data.forEach((event, i) => {
        if(event.Project_Number == project_number){
            terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">========================================================================================`, {raw:true})
            terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">========================================================================================`, {raw:true})
            terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">
                Project ${event.Project_Number} - ${event.Project_Name}
            <div>`, {raw:true})
            terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">========================================================================================
                <br>
                Overview
                <br>
                ----------------------------------------------------------------------------------------
                ${event.Overview}
            <div>`, {raw:true})
        }
    })
    weekly_data.forEach((event, i) => {
        if(event.Project_Number == project_number){
            terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">
                <br>========================================================================================<br>
                Week ${event.Week}: Project ${event.Project_Number} - ${event.Project_Name}
            <div>`, {raw:true})
            terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">----------------------------------------------------------------------------------------`, {raw:true})
            terminal.echo(`
            <div style="font-size: 20px; padding: 0% 10% 00% 10%">
            ${event.Text}
            <div>`, {raw:true})
        }
    })
    project_data.forEach((event, i) => {
        if(event.Project_Number == project_number){
            terminal.echo(`<div style="font-size: 20px; padding: 0% 10% 00% 10%">
                <br>========================================================================================<br>
                Next Steps
                <br>----------------------------------------------------------------------------------------<br>
                ${event.Next_Steps}
            <div>`, {raw:true})
        }
    })
}
export{outerFunction, weekly, projects, project}