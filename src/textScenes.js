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

        this.setup();
        this.events.on('wake', this.setup, this);
    }

    setup() {
        this.textObj.text = this.text;

        const callback = () => {
            this.textObj.text = this.text2;
            this.input.keyboard.once('keyup_SPACE', () => {
                this.scene.start(
                    this.nextScene,
                    {
                        nextLevelNumber: this.nextLevelNumber,
                        shields: this.shields,
                    }
                );
            });
        };

        this.time.addEvent({
            callback,
            delay: 2000,
        });
    }
}

class EndScene extends BaseScene {
    constructor() {
        super('endScene');
        this.text = 'You Win!';
        this.text2 = 'Space to continue';
        this.nextScene = 'titleScene';
    }
}

class LevelEndScene extends BaseScene {
    constructor() {
        super('levelEndScene');
        this.text = 'Level Complete';
        this.text2 = 'Space for next level';
        this.nextScene = 'gameScene';
    }
}

class TitleScene extends BaseScene {
    constructor() {
        super('titleScene');
        this.text = 'Space Game';
        this.text2 = 'Space to start';
        this.nextScene = 'gameScene';
    }
}

export {
    EndScene,
    LevelEndScene,
    TitleScene,
};
