
local CoinParticle = require("coinparticle")
local ScoreParticle = require("scoreparticle")

local Coin = class("Coin")
Coin.shape = love.physics.newCircleShape(20)

local soundsCoin = {
    love.audio.newSource("sounds/coin1.ogg"),
    love.audio.newSource("sounds/coin2.ogg"),
    love.audio.newSource("sounds/coin3.ogg")
}

for k, v in pairs(soundsCoin) do
    v:setVolume(0.25)
    v:setLooping(false)
end

local curCoinSound = 0

function Coin:initialize()
    self.body = love.physics.newBody(world, 0, 0, "static")
    self.fixture = love.physics.newFixture(self.body, self.shape, 1)
    self.fixture:setSensor(0)
    self.fixture:setUserData(self)
    self.offset = love.timer.getTime() + math.random(1, 100)
    self.existAnim = 1
end

function Coin:update(dt)
    if self.existAnim > 0 then
        self.existAnim = self.existAnim - dt
    end
end

function Coin:draw()
    love.graphics.push()
    love.graphics.translate(self:getPos())
    love.graphics.rotate(self:getAng()/360*math.pi)
    love.graphics.translate(0, math.cos(self.offset + love.timer.getTime()*2)*10)
    love.graphics.scale(math.cos(self.offset + love.timer.getTime()*2)/4 + 1, 1)
        -- love.graphics.circle("fill", 0, 0, 20, 10)
        -- love.graphics.draw(spriteCoin, -((60)/2), -((60)/2), 0, 60/300)

        if self.existAnim > 0 then
            love.graphics.translate(0, 50-easing.outElastic(1-self.existAnim, 0, 50, 1))
        end

        love.graphics.setColor(255, 255, 255)
        spriteCoin:draw(math.floor(self.offset + love.timer.getTime()*20)%9, 0, -32*(3/2), -32*(3/2), 0, 3/2, 3/2)
        -- spriteObject:draw(2, 0, -((100)/2)-16, -((100)/2)-16, 0, 100/(32-8))
    love.graphics.pop()
end

function Coin:getAng()
    return self.body:getAngle()
end

function Coin:getPos()
    return self.body:getPosition()
end

function Coin:setPos(x, y)
    return self.body:setPosition(x, y)
end

function Coin:getVel()
    return self.body:getLinearVelocity()
end

function Coin:setVel(x, y)
    return self.body:setLinearVelocity(x, y)
end

function Coin:isPlayer()
    return false
end

function Coin:destroy()
    if self.fixture ~= nil then
        self.fixture:destroy()
        self.fixture = nil
    end
end

function Coin:touch(other)
    if other:isPlayer() then
        game:removeCoin(self)
        game:addScore(100)

        local x, y = self:getPos()

        local scoreparticle = game:spawnParticle(ScoreParticle, x, y+50, 0)
        scoreparticle:setText("+100")

        for i = 1, 5 do
            local bright = math.random(0, 40)
            local particle = game:spawnParticle(CoinParticle, x, y, 0)
            particle:setCol(206 + bright, 164 + bright, 0 + bright)
        end

        love.audio.play(soundsCoin[curCoinSound+1])
        curCoinSound = (curCoinSound + 1)%#soundsCoin
    end
end

return Coin
