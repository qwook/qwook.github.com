
local Particle = class("ScoreParticle", require("particle"))

function Particle:initialize()
    self.x = 0
    self.y = 0
    self.ang = 0

    self.velx = math.random(-10, 10)*10
    self.vely = math.random(-25, -15)*20

    self.start = love.timer.getTime()
    self.id = math.random(1, 100)
    self.frame = 0
    self.frames = 7
    self.length = 1

    self.text = ""
end

function Particle:setText(text)
    self.text = text
end

function Particle:draw()
    love.graphics.push()
    love.graphics.translate(self:getPos())
    love.graphics.rotate(self:getAng())
    love.graphics.scale(3 + tonumber(self.text)/100)
        love.graphics.setFont(myFont)

        local t = (love.timer.getTime()-self.start)/self.length
        local t1 = easing.outElastic(t/0.5, 0, 1, 1)
        local t2 = easing.inQuint((t-0.5)/0.5, 0, 1, 1)
        love.graphics.setColor(120 + math.cos(love.timer.getTime()*5 + self.id)*120, 120 - math.cos(love.timer.getTime()*5 + self.id)*120, 120 + math.cos(love.timer.getTime()*6 + self.id)*120, 255)

        if t < 0.5 then
            love.graphics.translate(0, -t1*10)
        elseif t >= 0.5 then
            love.graphics.translate(0, -10-(t2*5))
        end

        local w = myFont:getWidth(self.text)
        local h = myFont:getHeight()
        love.graphics.print(self.text, -w/2, -h/2 - 5)
        -- love.graphics.draw(star, -((200)/2), -((200)/2), 0, 200/(64-8))

        love.graphics.setFont(boldFont)
    love.graphics.pop()
end

return Particle
