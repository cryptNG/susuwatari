

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

        let lastFromBlock=0;
        let lastToBlock=0;

        while(this.refresh){

            if(LibwalletMobileService.isLoaded){
                try{
                    const eventFilter = LibwalletMobileService.contract.filters.DroppedSusu();
            
                    let blockStep = 500;
                    const maxToBlock =await LibwalletMobileService.provider.getBlockNumber();
                    eventFilter.fromBlock=lastToBlock;
                    eventFilter.toBlock= (lastToBlock+blockStep)>maxToBlock?maxToBlock:lastToBlock+blockStep;
                    while(eventFilter.fromBlock!==maxToBlock && blockStep>0)
                    {
                        try{
                            const logs = await LibwalletMobileService.provider.getLogs(eventFilter);
                            if(logs.length>0)
                            {
                                logs.forEach((log)=>{

                                    const decLog = LibwalletMobileService.contract.interface.parseLog(log)
                                    if(decLog?.name==='DroppedSusu'){
                                        const data = LibwalletMobileService.interface.decodeEventLog("DroppedSusu",log.data);
                                     //   console.log(data);
                                        this.events.push({
                                            origin:data.originLocation,
                                            current:data.currentLocation,
                                            destination:data.destination,
                                            tokenId:data.tokenId,
                                            team:data.team
                                        });
                                    }
                                });
                            }
                            lastToBlock=eventFilter.toBlock;
                            eventFilter.toBlock=(lastToBlock+blockStep)>maxToBlock?maxToBlock:lastToBlock+blockStep;
                            eventFilter.fromBlock = lastToBlock;
                            
                        }catch(exc){
                            blockStep=blockStep>0?blockStep-100:blockStep;
                        }
                    }
                }catch(e){
                    console.error(e);
                }
            }

           
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

            let teamAPoints = BigInt(0);
            teamGroups[0].forEach((event)=>{
                const maxPoints = Math.trunc(Math.abs(Number(event.destination - event.origin)) / 10000);
                const lostPoints = Math.trunc(Math.abs(Number(event.destination - event.current)) / 10000);
                const realizedPoints = maxPoints - lostPoints;
                const pointsToAdd = BigInt((realizedPoints>0)? realizedPoints:0);
                teamAPoints = teamAPoints + pointsToAdd;
            });

            let teamBPoints = BigInt(0);
            teamGroups[1].forEach((event)=> {
                const maxPoints = Math.trunc(Math.abs(Number(event.destination - event.origin)) / 10000);
                const lostPoints = Math.trunc(Math.abs(Number(event.destination - event.current)) / 10000);
                const realizedPoints = maxPoints - lostPoints;
                const pointsToAdd = BigInt((realizedPoints>0)? realizedPoints:0);
                teamBPoints = teamBPoints + pointsToAdd;
            });

            this.teamPoints.set(0,teamAPoints);
            this.teamPoints.set(1,teamBPoints);

            

            await timeout(1000);
        }
    },
    async updateLeaderBoardUi (){
        while(this.refresh){

            document.querySelectorAll('.leader-board .team').forEach((ele)=>ele.classList.remove('winner'));
            const teamAPoints = this.teamPoints.get(0);
            const teamBPoints = this.teamPoints.get(1);

            document.querySelector('.leader-board .team-a .points').textContent=teamAPoints;
            document.querySelector('.leader-board .team-b .points').textContent=teamBPoints;

            if(teamAPoints>teamBPoints){
                document.querySelector('.leader-board .team-a').classList.add('winner');
            }
            if(teamAPoints<teamBPoints){
                document.querySelector('.leader-board .team-b').classList.add('winner');
            }

            if(teamAPoints===teamBPoints){
                const coin = Math.trunc(Math.random()*10) % 2;
                if(coin === 0){
                document.querySelector('.leader-board .team-b').classList.add('winner');
                }else{
                document.querySelector('.leader-board .team-a').classList.add('winner');
                }
            }

            await timeout(1000);
        }
    }
}