import angular from 'angular';
import {GameService} from "./gameService";

export class GameController {
    static $inject = ['$scope', '$interval'];

    constructor(private $scope: GameControllerScope, private $interval: angular.IIntervalService) {
        $scope.name = 'foo';
        $scope.timerPercent = 0;
        let secondsTick = 0;

        GameService.setSecondsToNextGeneration = (seconds) => {
            secondsTick = 100/(10*GameService.secondsPerGeneration);
            $scope.timerPercent = 100 - (seconds / GameService.secondsPerGeneration * 100);
        };

        $interval(() => {
            $scope.timerPercent += secondsTick;
            if ($scope.timerPercent > 100) {
                $scope.timerPercent = 0;
            }
        }, 100)
    }
}


interface GameControllerScope extends angular.IScope {
    timerPercent: number;
    name: string;
}
