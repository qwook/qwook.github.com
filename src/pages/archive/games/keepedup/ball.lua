
local Ball = class("Ball")
Ball.radius = 40
Ball.shape = love.physics.newCircleShape(Ball.radius)

local soundHit = love.audio.newSource("sounds/hit.ogg")
soundHit:setLooping(false)

local soundsHurt = {
    love.audio.newSource("sounds/hey.ogg"),
    love.audio.newSource("sounds/ow.ogg"),
    love.audio.newSource("sounds/snort.ogg")
}

for k, v in pairs(soundsHurt) do
    v:setLooping(false)
end

function Ball:initialize()
    self.body = love.physics.newBody(world, 0, 0, "dynamic")
    self.fixture = love.physics.newFixture(self.body, self.shape, 1)
    self.fixture:setUserData(self)
    self.body:setLinearVelocity(0, -250)
    self.body:setMass(100)
    self.body:setAwake(false)

    self.nextGroan = 0

    self.hitAnim = 0
    self.hitAng = 0
end

centerAccel = 0
function Ball:update(dt)
    if self.hitAnim > 0 then
        self.hitAnim = self.hitAnim - dt
    else
        self.hitAnim = 0
    end

    if self.body:isAwake() then
        local velX, velY = self.body:getLinearVelocity()

        local accel = 0
        if love.joystick.getJoystickCount() > 0 then
            local joystick = love.joystick.getJoysticks()[1]
            accel = joystick:getAxis(1)
        end

        local offsetedAccel = (accel - centerAccel)
        if math.abs(velX) < 200 or math.sign(offsetedAccel) ~= math.sign(velX) then
            if math.abs(offsetedAccel) > 0.03 then
                self.body:applyForce(-2000000 * (offsetedAccel), 0)
            end
        end
    end
end

function Ball:draw()
    love.graphics.push()
    love.graphics.translate(self:getPos())
        self:drawBall()
    love.graphics.pop()
end

function Ball:drawBall()
    love.graphics.push()
    love.graphics.scale(Ball.radius / 50)

        local s = 1
        local color = 0
        local yAnim = 0
        if self.hitAnim > 0 then
            if self.hitAnim > 0.5 then
                yAnim = 1 + math.floor((1-self.hitAnim)*8)%2
            end
            color = easing.outQuint(1 - self.hitAnim, 0, 1, 1)
            color = easing.sin(color)*100
            s = easing.outElastic(1 - self.hitAnim, 0.75, 0.25, 1)
        end
        love.graphics.rotate(-self.hitAng)
        love.graphics.scale(s, 1)
        love.graphics.rotate(self.hitAng)
        love.graphics.rotate(self:getAng())
        local scale = 100/(32-8)
        love.graphics.setColor(255, 255, 255)
        -- spriteObject:draw(0, yAnim, -32*scale/2, -32*scale/2, 0, scale)

        spriteEd:draw(yAnim, 0, -32*scale/2, -32*scale/2, 0*0.5, scale*0.5)
        -- love.graphics.draw(spriteBlobPants, -32*scale/2, -32*scale/2, 0*0.5, scale*0.5)

        -- love.graphics.setBlendMode("additive")
        love.graphics.setColor(255, 255, 255, color)
        spriteEd:draw(yAnim, 0, -32*scale/2, -32*scale/2, 0*0.5, scale*0.5)
        -- love.graphics.draw(spriteBlobPants, -32*scale/2, -32*scale/2, 0*0.5, scale*0.5)
        -- spriteObject:draw(0, yAnim, -32*scale/2, -32*scale/2, 0, scale)
        love.graphics.setBlendMode("alpha")

    love.graphics.pop()
end

function Ball:getAng()
    return self.body:getAngle()/360*math.pi
end

function Ball:getPos()
    return self.body:getPosition()
end

function Ball:setPos(x, y)
    return self.body:setPosition(x, y)
end

function Ball:getVel()
    return self.body:getLinearVelocity()
end

function Ball:setVel(x, y)
    return self.body:setLinearVelocity(x, y)
end

function Ball:rayCast(x1, y1, x2, y2, maxFraction, childIndex)
    return self.fixture:rayCast(x1, y1, x2, y2, maxFraction, childIndex)
end

function Ball:hitEffect()
    self.hitAnim = 1

    love.audio.play(soundHit)

    if love.timer.getTime() > self.nextGroan then
        love.audio.play(soundsHurt[math.random(1, 3)])
        self.nextGroan = love.timer.getTime() + 4
    end
end

function Ball:hit(ix, iy, x, y)
    local xVel, yVel = self.body:getLinearVelocity()

    self.hitAnim = 1
    -- self.body:setLinearVelocity(ix, iy)
    self.body:applyLinearImpulse((-xVel + ix) * self.body:getMass(), (-yVel + iy) * self.body:getMass(), x, y)
    self.hitAng = math.atan2(ix, iy)

    love.audio.play(soundHit)

    if love.timer.getTime() > self.nextGroan then
        love.audio.play(soundsHurt[math.random(1, 3)])
        self.nextGroan = love.timer.getTime() + 4
    end
end

function Ball:isPlayer()
    return true
end

function Ball:touch(other)
end

return Ball
