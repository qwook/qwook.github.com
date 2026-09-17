
local Particle = class("CoinParticle")

local star = love.graphics.newImage("img/keepedup_star.gif")

function Particle:initialize()
    self.x = 0
    self.y = 0
    self.ang = 0

    self.velx = math.random(-10, 10)*10
    self.vely = math.random(-25, -15)*10

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
    self.vely = self.vely + 1000*dt
    self.x = self.x + self.velx*dt
    self.y = self.y + self.vely*dt
end

function Particle:draw()
    love.graphics.push()
    love.graphics.translate(self:getPos())
    love.graphics.rotate(self:getAng())
        local t = 1 - (love.timer.getTime()-self.start)/self.length
        love.graphics.setColor(self.col.r, self.col.g, self.col.b, t*255)
        -- love.graphics.draw(star, 0, -((200)/2), -((200)/2), 0, 200/(64-8))
        love.graphics.draw(star, -((200)/2), -((200)/2), 0, 200/(64-8))
        -- love.graphics.circle("fill", 0, 0, 30, 10)
    love.graphics.pop()
end

function Particle:isDead()
    return (love.timer.getTime()-self.start) > self.length
end

return Particle
