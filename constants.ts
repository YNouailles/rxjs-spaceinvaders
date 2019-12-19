
export const gameSize = 20

export const enum Display {
    empty,
    player,
    invader,
    shot,
    collision,
}

export const enum ActionType {
    Move,
    Shot,
    InvaderPop,
    Refresh,
}

export const enum Direction { Left, Right }