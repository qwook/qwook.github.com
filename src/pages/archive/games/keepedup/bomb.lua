
local CoinParticle = require("coinparticle")
local ScoreParticle = require("scoreparticle")
local Particle = require("particle")

local Bomb = class("Bomb")
Bomb.shape = love.physics.newCircleShape(20)

local soundsBomb = {
    love.audio.newSource("sounds/explode1.ogg"),
    love.audio.newSource("sounds/explode2.ogg"),
    love.audio.newSource("sounds/explode3.ogg")
}

for k, v in pairs(soundsBomb) do
    v:setVolume(0.6)
    v:setLooping(false)
end

local curBombSound = 0

function Bomb:initialize()
    self.body = love.physics.newBody(world, 0, 0, "static")
    self.fixture = love.physics.newFixture(self.body, self.shape, 1)
    self.fixture:setSensor(0)
    self.fixture:setUserData(self)
    self.offset = love.timer.getTime() + math.random(1, 100)
    self.existAnim = 1

    self.exploding = 1
end

function Bomb:update(dt)
    if self.existAnim > 0 then
        self.existAnim = self.existAnim - dt
    end

    if self.exploding > 0 then
        self.exploding = self.exploding - dt/5
    else
        local x, y = self:getPos()
        local particle = game:spawnParticle(Particle, x, y, 0)
        particle:setCol(255, 255, 255)
        game:removeBomb(self)
        self.exploding = 0
    end
end

function Bomb:draw()
    love.graphics.push()
    love.graphics.translate(self:getPos())

    if self.existAnim > 0 then
        love.graphics.translate(0, 50-easing.outElastic(1-self.existAnim, 0, 50, 1))
    end


    love.graphics.rotate(self:getAng()/360*math.pi + self.offset)
    local o = math.cos(self.offset + love.timer.getTime()*6)/8;
    love.graphics.translate(-o, -o)
    local explodingUp = 1 - self.exploding;

    local s = math.cos(self.offset + love.timer.getTime()*6 + explodingUp*explodingUp*40)/(8-explodingUp) + 1.5;
    love.graphics.scale(s, s)
        -- love.graphics.circle("fill", 0, 0, 20, 10)
        -- love.graphics.draw(spriteBomb, -((60)/2), -((60)/2), 0, 60/300)

        love.graphics.setColor(255, 255, 255)
        spriteBomb:draw(math.floor(self.offset + love.timer.getTime()*15)%6, 0, -48/2, -58/2, 0, 3/2, 3/2)
        -- spriteObject:draw(2, 0, -((100)/2)-16, -((100)/2)-16, 0, 100/(32-8))
    love.graphics.pop()
end

function Bomb:getAng()
    return self.body:getAngle()
end

function Bomb:getPos()
    return self.body:getPosition()
end

function Bomb:setPos(x, y)
    return self.body:setPosition(x, y)
end

function Bomb:getVel()
    return self.body:getLinearVelocity()
end

function Bomb:setVel(x, y)
    return self.body:setLinearVelocity(x, y)
end

function Bomb:isPlayer()
    return false
end

function Bomb:destroy()
    if self.fixture ~= nil then
        self.fixture:destroy()
        self.fixture = nil
    end
end

function Bomb:touch(other)
    if self.existAnim > 0 then return end

    if other:isPlayer() then
        game:removeBomb(self)
        -- game:addScore(100)
        other:setVel(math.cos(self.offset - math.pi/2) * 600, math.sin(self.offset - math.pi/2) * 600);

        local x, y = self:getPos()

        -- local scoreparticle = game:spawnParticle(ScoreParticle, x, y+50, 0)
        -- scoreparticle:setText("+100")

        for i = 1, 5 do
            local bright = math.random(0, 40)
            local particle = game:spawnParticle(Particle, x, y, 0)
            particle:setCol(206, 0, 0)
        end

        love.audio.play(soundsBomb[curBombSound+1])
        curBombSound = (curBombSound + 1)%#soundsBomb
    end
end

return Bomb
