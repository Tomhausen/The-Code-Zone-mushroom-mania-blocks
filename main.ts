namespace SpriteKind {
    export const floor = SpriteKind.create()
}
function new_row_spawn () {
    if (scene.cameraProperty(CameraProperty.Bottom) >= new_spawn_y) {
        generate_row(new_spawn_y + 8)
        if (randint(1, 5) == 1) {
            spawn_coin()
        }
        new_spawn_y += 16
        info.changeScoreBy(100)
    }
}
function generate_row (y: number) {
    row = []
    place_tiles(y)
    if (randint(1, 10) == 1) {
        for (let placed_tile of row) {
            placed_tile.setImage(assets.tile`off path`)
        }
        return
    }
    if (randint(1, 2) == 1) {
        spawn_positions.push(row.shift())
    } else {
        spawn_positions.push(row.pop())
    }
    spawn_enemy(spawn_positions[spawn_positions.length - 1])
}
function spawn_enemies () {
    for (let spawn_point of spawn_positions) {
        if (randint(1, 250) == 1) {
            spawn_enemy(spawn_point)
        }
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.throttle("move", 50, function () {
        move(assets.animation`left`, -2, 0)
    })
})
function place_tiles (y: number) {
    x = 8
    for (let index = 0; index < 10; index++) {
        tile = sprites.create(assets.tile`path`, SpriteKind.floor)
        tile.setPosition(x, y)
        tile.z = -10
        tile.setFlag(SpriteFlag.AutoDestroy, true)
        row.push(tile)
        x += 16
    }
}
function spawn_coin () {
    coin = sprites.create(assets.animation`coin`[0], SpriteKind.Food)
    animation.runImageAnimation(
    coin,
    assets.animation`coin`,
    100,
    true
    )
    coin.setPosition(randint(10, 150), new_spawn_y - 8)
    coin.z = 10
    coin.setFlag(SpriteFlag.AutoDestroy, true)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player2, enemy) {
    game.over(false)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.throttle("move", 50, function () {
        move(assets.animation`right`, 2, 0)
    })
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Enemy, function (enemy, other_enemy) {
    other_enemy.destroy()
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.throttle("move", 50, function () {
        move(assets.animation`forward`, 0, 2)
        spawn_positions.shift()
    })
})
function spawn_enemy (spawn_sprite: Sprite) {
    if (spawn_sprite.y == 8) {
        return
    }
    enemy = sprites.create(assets.image`mushroom`, SpriteKind.Enemy)
    if (spawn_sprite.x > 80) {
        enemy.setPosition(spawn_sprite.x + 10, spawn_sprite.y)
        animation.runImageAnimation(
        enemy,
        assets.animation`mushroom left`,
        100,
        true
        )
        enemy.vx = -20
    } else {
        enemy.setPosition(spawn_sprite.x - 10, spawn_sprite.y)
        animation.runImageAnimation(
        enemy,
        assets.animation`mushroom right`,
        100,
        true
        )
        enemy.vx = 20
    }
    enemy.setFlag(SpriteFlag.AutoDestroy, true)
}
function setup () {
    y = 8
    for (let index = 0; index < 8; index++) {
        generate_row(y)
        y += 16
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    info.changeScoreBy(1000)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    sprites.destroy(otherSprite)
})
function move (anim: any[], x_change: number, y_change: number) {
    animation.runImageAnimation(
    witch,
    anim,
    100,
    false
    )
    for (let index = 0; index < 8; index++) {
        witch.x += x_change
        witch.y += y_change
        pause(50)
    }
}
let y = 0
let enemy: Sprite = null
let coin: Sprite = null
let tile: Sprite = null
let x = 0
let row: Sprite[] = []
let spawn_positions: Sprite[] = []
let new_spawn_y = 0
let witch: Sprite = null
witch = sprites.create(assets.image`witch`, SpriteKind.Player)
witch.y = 8
witch.setStayInScreen(true)
let camera_offset = 52
new_spawn_y = 128
spawn_positions = []
setup()
game.onUpdate(function () {
    scene.centerCameraAt(80, witch.y + camera_offset)
    new_row_spawn()
    spawn_enemies()
})
