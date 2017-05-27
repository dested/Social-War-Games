import {GameState, GameMetrics, VoteResponse} from "./models/hexBoard";
import {PossibleActions} from "./ui/gameService";


let rawDeflateWorker = new Worker("/libs/RawDeflate.js");

export class WorkerService {
    static payloads: { [key: string]: (payload: any) => void } = {};

    static start() {
        rawDeflateWorker.onmessage = (ev) => {
            let p = WorkerService.payloads[ev.data.key];
            delete WorkerService.payloads[ev.data.key];
            if (p) p(ev.data.payload);
        };
    }

    static deflate(data: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let key = (Math.random() * 1000000).toFixed(0);
            WorkerService.payloads[key] = resolve;
            rawDeflateWorker.postMessage({key: key, payload: data});
        })
    }
}
WorkerService.start();

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
            if (!response.ok) // or check for response.status
                throw new Error(response.statusText);
            let json = await response.json();

            var m = await WorkerService.deflate(json.data);
            m.metrics.nextGenerationDate = new Date(m.metrics.nextGeneration);
            return m.metrics;
        } catch (ex) {
            console.error('Fetch Error :-S', ex);
            return ex;
        }
    }

    static async vote(vote: { entityId: string, action: PossibleActions, userId: string, generation: number, x: number, z: number }): Promise<VoteResponse> {
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
            if (json.meta.errors) {
                console.error(json.meta.errors);
                return null;
            }

            return json.data;
        } catch (ex) {
            console.error(ex);
            return ex;
        }
    }

    static compressor = new Compressor();

    static async getGameState(): Promise<GameState> {
        try {
            let response = await fetch(this.voteServer + 'api/game/state', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) // or check for response.status
                throw new Error(response.statusText);
            let json = await response.json();

            var m = await WorkerService.deflate(json.data);

            return m.state;
        } catch (ex) {
            console.error('Fetch Error :-S', ex);
            return ex;
        }

    }

    static async getGenerationResult(generation: number): Promise<GameMetrics> {
        try {
            let response = await fetch(this.voteServer + 'api/game/result?generation=' + generation, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) // or check for response.status
                throw new Error(response.statusText);
            let json = await response.json();
            var m = await WorkerService.deflate(json.data);

            return m.metrics;
        } catch (ex) {
            console.error('Fetch Error :-S', ex);
            return ex;
        }

    }
}