import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
    constructor(key) {
        super({
            key,
        });
    }

    init(data) {
        this.shields = data.shields || 3;
        this.nextLevelNumber = data.nextLevelNumber || 0;
    }

    create() {
        const cam = this.cameras.main;

        this.textObj = this.add.text(
            cam.width / 2,
            cam.height / 2,
            this.text,
            {
                fill: '#ffffff',
                font: '25px Courier',
            }
        ).setOrigin(0.5);

        this.textObj.text = this.text;
        this.setup();
    }

    setup() {
        this.startNextScene();
    }

    startNextScene() {
        this.scene.start(this.nextScene,
            {
                nextLevelNumber: this.nextLevelNumber,
                shields: this.shields,
            }
        );
    }
}

class DelayScene extends BaseScene {
    constructor(key, text, delayTime, nextScene) {
        super(key);

        this.text = text;
        this.delayTime = delayTime;
        this.nextScene = nextScene;
    }

    setup() {
        this.time.addEvent({
            callback: this.startNextScene.bind(this),
            delay: this.delayTime,
        });
    }
}

class PressSpaceScene extends BaseScene {
    constructor(key, text, nextScene) {
        super(key);

        this.text = text;
        this.nextScene = nextScene;
    }

    setup() {
        this.input.keyboard.addCapture('SPACE');
        this.input.keyboard.once('keyup-SPACE',
            this.startNextScene.bind(this));
    }
}

class EndScene extends DelayScene {
    constructor() {
        super('endScene', 'You Win!', 2000, 'titleScene');
    }
}

class LevelEndScene extends DelayScene {
    constructor() {
        super('levelEndScene', 'Level Complete', 2000, 'gameScene');
    }
}

class TitleScene extends PressSpaceScene {
    constructor() {
        super('titleScene', 'Space to start', 'gameScene');
    }
}

class GameOverScene extends DelayScene {
    constructor() {
        super('gameOverScene', 'Game over!', 2000, 'titleScene');
    }
}

export {
    EndScene,
    GameOverScene,
    LevelEndScene,
    TitleScene,
};
