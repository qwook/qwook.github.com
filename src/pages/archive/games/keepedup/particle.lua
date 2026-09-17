
local Particle = class("Particle")

function Particle:initialize()
    self.x = 0
    self.y = 0
    self.ang = 0

    self.col = {r=255, g=255, b=255}

    self.start = love.timer.getTime()
    self.frame = 0
    self.frames = 7
    self.length = 0.3
end

function Particle:setPos(x, y)
    self.x = x
    self.y = y
end

function Particle:getPos()
    return self.x, self.y
end

function Particle:setAng(ang)
    self.ang = ang
end

function Particle:getAng()
    return self.ang
end

function Particle:setCol(r, g, b)
    self.col = {r=r, g=g, b=b}
end

function Particle:update(dt)

end

function Particle:draw()
    love.graphics.push()
    love.graphics.translate(self:getPos())
    love.graphics.rotate(self:getAng())
        -- love.graphics.circle("fill", 0, 0, 50, 10)
        local t = (love.timer.getTime()-self.start)/self.length
        local f = math.floor(t*self.frames)
        love.graphics.setColor(self.col.r, self.col.g, self.col.b)
        spriteParticle:draw(f, 0, -((200)/2), -((200)/2), 0, 200/(64-8))
    love.graphics.pop()
end

function Particle:isDead()
    return (love.timer.getTime()-self.start) > self.length
end

return Particle
