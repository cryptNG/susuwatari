

document.addEventListener("DOMContentLoaded", async ()=> {
    document.querySelector('nav .leader-board').addEventListener('click',(e)=>{

       document.querySelectorAll('.pane').forEach((pane)=> {
        pane.classList.remove('active');
       } );
       document.querySelectorAll('nav span').forEach((menu)=> {
        menu.classList.remove('active');
       } );
        document.querySelector('nav .leader-board').classList.add('active');
        document.querySelector('#leader-board-pane').classList.add('active');
    },false);
});

const LeaderBoard = {
    isOpen:false,
    refresh:true,
    events:[],
    tokens:new Map(),
    teamPoints:new Map(),
    async init(){
        this.teamPoints.set(0,0);
        this.teamPoints.set(1,0);
        this.autoRefreshDropEvents();
        this.calculateLeaderBoard();
        this.updateLeaderBoardUi();
    },
    async autoRefreshDropEvents (){
       
        while(this.refresh){
            const tokenId=Math.trunc((Math.random()*100)) % 10;
            const pos1 ={
                lat:Math.trunc((Math.random()*180 - 90) * 100000)/100000,
                lon:Math.trunc((Math.random()*360 - 180) * 100000)/100000,
            }
            const pos2 ={
                lat:Math.trunc((Math.random()*180 - 90) * 100000)/100000,
                lon:Math.trunc((Math.random()*360 - 180) * 100000)/100000,
            }
            const pos3 ={
                lat:Math.trunc((Math.random()*180 - 90) * 100000)/100000,
                lon:Math.trunc((Math.random()*360 - 180) * 100000)/100000,
            }
            this.events.push({
                origin:getSpotIdForCoordinates(pos1),
                current:getSpotIdForCoordinates(pos2),
                destination:getSpotIdForCoordinates(pos3),
                tokenId:tokenId,
                team:tokenId % 2

            });
            await timeout(1000);
        }
    },

    async calculateLeaderBoard (){
        let lastEventsPos = 0;
        
        while(this.refresh){
            for(let i = lastEventsPos; i < this.events.length;i++){
                this.tokens.set(this.events[i].tokenId,this.events[i]);
            }

            lastEventsPos=this.events.length;
            const teamGroups =[...this.tokens.values()].reduce((a,c)=>{
                a[c.team].push(c);
                return a;
            },{0:[],1:[]});

            let teamAPoints = 0;
            teamGroups[0].forEach((event)=>{
                teamAPoints += event.tokenId;
            });

            let teamBPoints = 0;
            teamGroups[1].forEach((event)=> {
                teamBPoints += event.tokenId;
            });

            this.teamPoints.set(0,teamAPoints);
            this.teamPoints.set(1,teamBPoints);

            await timeout(1000);
        }
    },
    async updateLeaderBoardUi (){
        while(this.refresh){

            document.querySelector('.leader-board .team-a .points').textContent=this.teamPoints.get(0);
            document.querySelector('.leader-board .team-b .points').textContent=this.teamPoints.get(1);

            await timeout(1000);
        }
    }
}