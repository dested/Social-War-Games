import React from "react";

import {GameService} from "./gameService";
import {BaseEntity} from "../entities/baseEntity";
import {EntityDetails} from "../entities/entityDetails";
import {PossibleActions} from "../entities/entityManager";


export class GameUI extends React.Component<{}, GameUIState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            name: 'foo',
            timerPercent: 0,
            loading: true,
            selectedAction: 'move',
            selectedEntity: null,
            canAttack: false,
            canMove: false,
            canSpawn: false,
            maxEntityHealth: 0
        };
    }

    componentDidMount() {
        let secondsTick = 0;
        GameService.onSetSelectedEntity = (entity: BaseEntity) => {
            if (entity) {
                let detail = EntityDetails.instance.details[entity.entityType];
                this.setState({
                    canSpawn: detail.spawnRadius > 0,
                    canAttack: detail.attackRadius > 0,
                    canMove: detail.moveRadius > 0,
                    selectedAction: GameService.selectedAction,
                    maxEntityHealth: detail.health,
                    selectedEntity: entity
                })

            } else {
                this.setState({
                    canSpawn: false,
                    canAttack: false,
                    canMove: false,
                    selectedAction: null,
                    maxEntityHealth: 0,
                    selectedEntity: null
                });
            }
        };

        GameService.hasData = () => {
            this.setState({
                loading: false
            });
        };
        GameService.setSecondsToNextGeneration = (seconds) => {
            secondsTick = 100 / (10 * GameService.secondsPerGeneration);
            this.setState({
                timerPercent: Math.min(100 - (seconds / GameService.secondsPerGeneration * 100), 100)
            });
        };

        setInterval(() => {
            let timePercent = this.state.timerPercent;
            if (timePercent < 100) {
                timePercent += secondsTick;
            }
            timePercent = Math.min(timePercent, 100);
            this.setState({
                timerPercent: timePercent
            });
        }, 100)
    }

    componentWillUnmount() {
    }

    private setSelectedAction(action: PossibleActions) {
        this.setState({
            selectedAction: action
        });

        GameService.selectedAction = action;
        setTimeout(() => {
            GameService.getGameManager().startAction();
        }, 0)
    }

    render() {
        return (
            <div>
                <div className="game-ui" style={{display: this.state.loading ? 'none' : 'block'}}>
                    <div className="countdown-container">
                        <div className={`countdown-container-ticker ${this.state.timerPercent >= 96 && 'countdown-frozen'}`}
                             style={{width: `${this.state.timerPercent}%`}}>
                        </div>
                    </div>

                    <div className="center">
                        {
                            this.state.selectedEntity &&
                            <div style={{height: '100%'}}>
                                <img src={`/images/${this.state.selectedEntity.entityType}/up_1.png`}
                                     style={{float: 'left', width: '6vw', height: '6vh', marginLeft: '10px', marginTop: '10px'}}/>
                                <div style={{float: 'left', marginLeft: '20px'}}>
                                    <span className="label">Health: {this.state.selectedEntity.health}/{this.state.maxEntityHealth}</span><br/>
                                    <span className="label">Votes: {this.state.selectedEntity.totalVoteCount}</span>
                                </div>
                                {
                                    this.state.canMove &&
                                    <div className={`action-button move-button ${this.state.selectedAction == 'move' && 'selected-button'}` }
                                         onClick={() => this.setSelectedAction('move')}>
                                        Move
                                    </div>
                                }
                                {
                                    this.state.canAttack &&
                                    <div className={`action-button attack-button ${this.state.selectedAction == 'attack' && 'selected-button'}` }
                                         onClick={() => this.setSelectedAction('attack')}>
                                        Attack
                                    </div>
                                }
                                {
                                    this.state.canSpawn &&
                                    <div className={`action-button spawn-button ${this.state.selectedAction == 'spawn' && 'selected-button'}` }
                                         onClick={() => this.setSelectedAction('spawn')}>
                                        Tank
                                    </div>
                                }
                            </div>
                        }
                    </div>

                    <div className="left-bubble" id="leftBubble">

                    </div>
                </div>
                {
                    this.state.loading && <div className="loading">>Loading&#8230;</div>
                }
            </div>
        );
    }

}


interface GameUIState {
    selectedEntity: BaseEntity;
    maxEntityHealth: number;
    loading: boolean;
    timerPercent: number;
    name: string;
    canAttack: boolean;
    canSpawn: boolean;
    canMove: boolean;
    selectedAction: PossibleActions;
}

