import {GameState, GameMetrics} from "./models/hexBoard";
declare let fetch;

export class DataService {

    // private static voteServer: string = 'https://vote.socialwargames.com/';
    private static voteServer: string = 'http://localhost:3568/';

    static async getGameMetrics(): Promise<GameMetrics> {
        try {
            let response = await fetch(this.voteServer + 'api/game/metrics', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let json = await response.json();
            return json.data.metrics;
        } catch (ex) {
            console.log('Fetch Error :-S', ex);
            return ex;
        }
    }
    static async vote(vote:{entityId:string,action:string,userId:string,generation:number,x:number,z:number}): Promise<void> {
        try {
            let response = await fetch(this.voteServer + 'api/game/vote', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vote)
            });

            let json = await response.json();
            return json.data;
        } catch (ex) {
            console.log('Fetch Error :-S', ex);
            return ex;
        }
    }


    static async  getGameState() : Promise<GameState> {
        try {
            let response = await fetch(this.voteServer + 'api/game/state', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let json = await response.json();
            return json.data.state;
        } catch (ex) {
            console.log('Fetch Error :-S', ex);
            return ex;
        }

    }
}