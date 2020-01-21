import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
    constructor(key) {
        super({
            key,
        });
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

        const callback = () => {
            this.textObj.text = this.text2;
            this.input.keyboard.once('keyup_SPACE', () => {
                this.scene.start(
                    this.nextScene,
                    { nextLevelNumber: this.nextLevelNumber }
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

    init(data) {
        this.nextLevelNumber = data.nextLevelNumber;
    }
}

class TitleScene extends BaseScene {
    constructor() {
        super('titleScene');
        this.text = 'Space Game';
        this.text2 = 'Space to start';
        this.nextScene = 'gameScene';
        this.nextLevelNumber = 0;
    }
}

export {
    EndScene,
    LevelEndScene,
    TitleScene,
};
