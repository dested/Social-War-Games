import angular from 'angular';
import {GameService} from "./gameService";
import {BaseEntity} from "../entities/baseEntity";
import {EntityDetails} from "../entities/entityDetails";
import {PossibleActions} from "../entities/entityManager";

export class GameController {
    static $inject = ['$scope', '$interval'];

    constructor(private $scope: GameControllerScope, private $interval: angular.IIntervalService) {
        $scope.model = <any>{};
        $scope.model.name = 'foo';
        $scope.model.timerPercent = 0;
        let secondsTick = 0;
        $scope.model.loading = true;

        $scope.model.selectedAction = 'move';
        $scope.model.setSelectedAction = (action) => {
            $scope.model.selectedAction = action;
            GameService.selectedAction = action;
            setTimeout(() => {
                GameService.getGameManager().startAction();
            }, 0)
        };

        GameService.onSetSelectedEntity = (entity: BaseEntity) => {
            $scope.model.selectedEntity = entity;

            if ($scope.model.selectedEntity) {
                let detail = EntityDetails.instance.details[entity.entityType];
                $scope.model.canSpawn = detail.spawnRadius > 0;
                $scope.model.canAttack = detail.attackRadius > 0;
                $scope.model.canMove = detail.moveRadius > 0;
                $scope.model.selectedAction = GameService.selectedAction;
                $scope.model.maxEntityHealth = detail.health;
            } else {
                $scope.model.canSpawn = false;
                $scope.model.canAttack = false;
                $scope.model.canMove = false;
                $scope.model.selectedAction = null;
            }
            $scope.$apply();
        };

        GameService.hasData = () => {
            $scope.model.loading = false;
            $scope.$apply();
        };
        GameService.setSecondsToNextGeneration = (seconds) => {
            secondsTick = 100 / (10 * GameService.secondsPerGeneration);
            $scope.model.timerPercent = Math.min(100 - (seconds / GameService.secondsPerGeneration * 100), 100);
            $scope.$apply();
        };

        $interval(() => {
            if ($scope.model.timerPercent < 100) {
                $scope.model.timerPercent += secondsTick;
            }
            $scope.model.timerPercent = Math.min($scope.model.timerPercent, 100);
        }, 100)
    }
}


interface GameControllerScope extends angular.IScope {
    model: GameControllerModel;
}

interface GameControllerModel {
    selectedEntity: BaseEntity;
    maxEntityHealth: number;
    loading: boolean;
    timerPercent: number;
    name: string;
    canAttack: boolean;
    canSpawn: boolean;
    canMove: boolean;
    selectedAction: PossibleActions;
    setSelectedAction: (action: PossibleActions) => void;
}
