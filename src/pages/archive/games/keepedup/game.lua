
local Ball = require("ball")
local Coin = require("coin")
local Bomb = require("bomb")
local Particle = require("particle")
local ScoreParticle = require("scoreparticle")
local LaserParticle = require("laserparticle")

local Game = class("Game")

local click = love.audio.newSource("sounds/play.ogg")
click:setLooping(false)

local soundSwing = love.audio.newSource("sounds/swing.ogg")
soundSwing:setLooping(false)

local music = love.audio.newSource("sounds/keepedup.ogg")
music:setLooping(true)
music:setVolume(0.5)

function onTouch(fix1, fix2)
    local obj1 = fix1:getUserData()
    local obj2 = fix2:getUserData()
    obj1:touch(obj2)
    obj2:touch(obj1)
end

function endTouch(fix1, fix2)
    local obj1 = fix1:getUserData()
    local obj2 = fix2:getUserData()
end

function Game:initialize()
    world = love.physics.newWorld(0, 9.8*love.physics.getMeter(), false)
    world:setCallbacks(onTouch, endTouch)

    ball = Ball:new()
    ball:setPos(0, 0)

    coinMax = 4

    -- lists of stuff...
    coins = {}
    bombs = {}
    particles = {}
    enemies = {}
    destroyed = {}

    for i = 1, 10 do
        self:spawnCoin()
    end

    self.gameover = false
    self.gameoverTime = 0

    self.doubleClick = 0
    self.click = 0 -- detect if the player clicked

    self.nextCheck = 0
    self.nextHit = 0
    self.nextCoinSpawn = 0
    self.scoreAnim = 0
    self.score = 0
    self.bestscore = 0
    self.pressedRetryTime = 0
    self.pressedRetry = false

    self.nextBombSpawn = love.timer.getTime() + math.random(3, 10);

    self.trailStack = {}

    self.debugForce = 0
    self.debugAng = 0

    self:loadScore()

    -- for debugging secrets
    self.secretCount = 0
    self.secretCorner = 0

    self.offsetx = 0

    -- idk what happened here but it shoudl start out with tutorial and not dying

    self.gameover = false
    self.score = 0

    for k, v in pairs(coins) do
        v:destroy()
    end
    coins = {}

    for k, v in pairs(bombs) do
        v:destroy()
    end
    bombs = {}

    ball:setPos(0, 0)
    ball:setVel(0, 0)
    ball.body:setAwake(false)

    for i = 1, 10 do
        self:spawnCoin()
    end

    self.trailStack = {}
end

function Game:spawnParticle(class, x, y, ang)
    local particle = class:new()
    particle:setPos(x, y)
    particle:setAng(ang)
    table.insert(particles, particle)

    return particle
end

function Game:spawnCoin()
    local w = love.graphics.getWidth()/Scale/2 * 0.9
    local h = love.graphics.getHeight()/Scale/2 * 0.9

    local dist = 0
    local x = math.random(-w, w)
    local y = math.random(-h, h*0.5)
    local i = 0
    while (dist < 60 and #coins ~= 0 and i < 10) do
        i = i + 1
        x = math.random(-w, w)
        y = math.random(-h, h*0.5)
        dist = nil
        for k, v in pairs(coins) do
            local x2, y2 = v:getPos()
            local dist2 = math2d.distance(x, y, x2, y2)
            dist = math.min(dist or dist2, dist2)
        end

        if (dist >= 60) then
            local xPl, yPl = ball:getPos()
            local distPlayer = math2d.distance(x, y, xPl, yPl) - 60
            dist = distPlayer
        end
    end

    if i < 10 then
        local coin = Coin:new()
        coin:setPos(x, y)
        table.insert(coins, coin)
    end
end

function Game:spawnBomb()
    local w = love.graphics.getWidth()/Scale/2 * 0.9
    local h = love.graphics.getHeight()/Scale/2 * 0.9

    local dist = 0
    local x = math.random(-w, w)
    local y = math.random(-h, h*0.5)
    local i = 0
    while (dist < 60 and #bombs ~= 0 and i < 30) do
        i = i + 1
        x = math.random(-w, w)
        y = math.random(-h, h*0.5)
        dist = nil
        for k, v in pairs(bombs) do
            local x2, y2 = v:getPos()
            local dist2 = math2d.distance(x, y, x2, y2)
            if dist == nil then dist = dist2 end
            dist = math.min(dist, dist2)
        end

        if (dist >= 60) then
            local xPl, yPl = ball:getPos()
            local distPlayer = math2d.distance(x, y, xPl, yPl) - 120
            dist = distPlayer
        end


        if i == 30 then
            return
        end
    end

    if i < 30 then
        print(dist)
        local bomb = Bomb:new()
        bomb:setPos(x, y)
        table.insert(bombs, bomb)
    end
end

function Game:removeCoin(coin)
    for k, v in pairs(coins) do
        if v == coin then
            table.insert(destroyed, v)
            table.remove(coins, k)
        end
    end
end

function Game:removeBomb(bomb)
    for k, v in pairs(bombs) do
        if v == bomb then
            table.insert(destroyed, v)
            table.remove(bombs, k)
        end
    end
end

function Game:removeEnemy(enemy)
    for k, v in pairs(enemies) do
        if v == enemy then
            table.insert(destroyed, v)
            table.remove(enemies, k)
        end
    end
end

local xMouse = love.mouse.getX() - love.graphics.getWidth()/2
local yMouse = love.mouse.getY() - love.graphics.getHeight()/2
local xOldMouse, yOldMouse = xMouse, yMouse

function Game:update(dt)
    -- clean up particles
    local i = 1
    while (i <= #particles) do
        local particle = particles[i]
        if particle:isDead() then
            table.remove(particles, i)
            i = i - 1
        else
            particle:update(dt)
        end
        i = i + 1
    end

    -- clean up coins and enemies
    for k, v in pairs(destroyed) do
        v:destroy()
    end
    destroyed = {}

    -- any juicy animation stuff
    if self.scoreAnim > 0 then self.scoreAnim = self.scoreAnim - dt*2 else self.scoreAnim = 0 end

    if not ball.body:isAwake() then
        -- calculate center accel
        -- centerAccel = {p = 0, y = 0, r = 0}
        centerAccel = 0
        if love.joystick.getJoystickCount() > 0 then
            local joystick = love.joystick.getJoysticks()[1]
            centerAccel = joystick:getAxis(1)
        end
    end

    if self.gameover then return end

    xMouse, yMouse = self:mousePos()
    xDelta = xMouse - xOldMouse
    yDelta = yMouse - yOldMouse

    -- do attack logic
    if love.mouse.isDown("l") then
        local xHit, yHit, fraction = ball:rayCast(xMouse-xDelta, yMouse-yDelta, xMouse, yMouse, 1)

        local x1, y1, x2, y2 = xMouse-xDelta, yMouse-yDelta, xMouse, yMouse
        local xBall, yBall = ball:getPos()

        -- calculate the force/velocity
        local force = 0
        local xForce = 0
        local yForce = 0
        local i = #self.trailStack + 1
        local n = 0
        local lastAng
        local inside = false
        while (i > 0) do
            local trailSnapshot = self.trailStack[i]
            local trailSnapshot2 = self.trailStack[i-1]

            if not trailSnapshot and trailSnapshot2 then
                trailSnapshot = {x=xMouse, y=yMouse, time=love.timer.getTime()}
            end

            if not trailSnapshot or not trailSnapshot2 then break end

            if math2d.distance( trailSnapshot.x, trailSnapshot.y, xBall, yBall ) <= Ball.radius
            or math2d.distance( trailSnapshot2.x, trailSnapshot2.y, xBall, yBall ) <= Ball.radius
            then
                inside = true
            end

            local xVel = trailSnapshot.x - trailSnapshot2.x
            local yVel = trailSnapshot.y - trailSnapshot2.y

            lastAng = lastAng or math.atan2(yVel, xVel)
            if math.abs(math2d.angle(xVel, yVel, math.cos(lastAng), math.sin(lastAng))) > math.pi/100 then break end
            lastAng = math.atan2(yVel, xVel)

            local delta = trailSnapshot.time - trailSnapshot2.time

            xVel = xVel / delta
            yVel = yVel / delta

            xForce = xForce + xVel
            yForce = yForce + yVel

            n = n + 1
            i = i - 1
        end
        if n == 0 then
            xForce = 0
            yForce = 0
        else
            xForce = xForce / n * 0.75
            yForce = yForce / n * 0.75
        end

        force = math2d.length(xForce, yForce)

        self.debugForce = force * 0.25
        self.debugAng = math.atan2(yForce, xForce)

        -- if force > 20 then
        --     love.audio.play(soundSwing)
        -- end

        -- the trace is inside the ball
        -- if math2d.distance( xOldMouse, yOldMouse, xBall, yBall ) <= Ball.radius then
            -- fraction = xOldMouse, yOldMouse, 1
            -- local xNorm, yNorm = math2d.normal(xDelta, yDelta)
            -- xHit = xBall - xNorm*Ball.radius
            -- yHit = yBall - xNorm*Ball.radius
            -- fraction = 0
            -- x1, y1 = xHit, yHit
            -- x2, y2 = xHit, yHit
            -- force = force*2

            -- we clicked it
            -- local clickTime = love.timer.getTime() - self.click
            -- if clickTime < 0.5 and clickTime > 0.25 and force == 0 then
            --     xHit, yHit = xBall, yBall
            --     -- xDelta = (xBall - xOldMouse)*0.5
            --     xDelta = -xOldMouse/10 -- go towards the center
            --     yDelta = -20
            --     force = math2d.length(xDelta, yDelta)
            -- end

        -- end

        if (fraction or inside) and force > 50 and self.nextHit < love.timer.getTime() then
            local xNorm, yNorm = math2d.normal(xForce, yForce)
            local xHit, yHit = xBall - xNorm*Ball.radius, yBall - yNorm*Ball.radius
            ball:hit(xForce, yForce, xHit, yHit)
            if (not musicIsPlaying) then
                musicIsPlaying = true
                love.audio.play(music)
            end
            self.nextHit = love.timer.getTime() + 0.5

            -- self:spawnParticle(Particle, xHit, yHit, math.atan2(yNorm, xNorm))

            self:spawnParticle(Particle, xBall, yBall, math.atan2(yNorm, xNorm))


            local scoreparticle = self:spawnParticle(ScoreParticle, xHit, yHit - 100, 0)
            scoreparticle:setText("+10")
            self:addScore(10)
        end

        -- the old hit function:

        -- if force > 0 and fraction and self.nextHit < love.timer.getTime() then
        --     -- local xWorldHit, yWorldHit = x1 + (x2 - x1) * fraction, y1 + (y2 - y1) * fraction
        --     local xNorm, yNorm = math2d.normal(xDelta, yDelta)
        --     local xWorldHit, yWorldHit = xBall - xNorm*Ball.radius, yBall - yNorm*Ball.radius
        --     ball:hit(xNorm * force*30, yNorm * force*30, xHit, yHit)
        --     self:spawnParticle(Particle, xWorldHit + xNorm*30, yWorldHit + yNorm*30, math.atan2(yNorm, xNorm))
        --     local scoreparticle = self:spawnParticle(ScoreParticle, xWorldHit + xNorm*30, yWorldHit + yNorm*30, 0)
        --     scoreparticle:setText("+10")
        --     self:addScore(10)
        --     self.nextHit = love.timer.getTime() + 0.5
        -- end
    end

    if self.nextCheck < love.timer.getTime() then
        if love.mouse.isDown("l") then
            xOldMouse, yOldMouse = xMouse, yMouse
            table.insert(self.trailStack, {x=xOldMouse, y=yOldMouse, time=love.timer.getTime()})
            self.nextCheck = love.timer.getTime() + 0
        end

        if #self.trailStack > 10 or (#self.trailStack > 0 and not love.mouse.isDown("l")) then
            table.remove(self.trailStack, 1)
        end

    end

    if self.nextCoinSpawn < love.timer.getTime() and #coins < coinMax then
        self:spawnCoin()
        self.nextCoinSpawn = love.timer.getTime() + 2
    end

    if self.nextBombSpawn < love.timer.getTime() then
        self:spawnBomb()
        self.nextBombSpawn = love.timer.getTime() + math.random(3, 10)
    end


    -- check if the player died
    local xPl, yPl = ball:getPos()
    if yPl > love.graphics.getHeight()/2/Scale
    -- or yPl < -love.graphics.getHeight()/2/Scale - 500
    or xPl > love.graphics.getWidth()/2/Scale + Ball.radius
    or xPl < -love.graphics.getWidth()/2/Scale - Ball.radius
    then
        if self.score > self.bestscore then
            self.highScore = true
        else
            self.highScore = false
        end
        self:saveScore()
        self.gameover = true
        self.gameoverTime = love.timer.getTime()
    end

    world:update(dt)
    ball:update(dt)

    for k, v in pairs(coins) do
        v:update(dt)
    end

    for k, v in pairs(bombs) do
        v:update(dt)
    end

    for k, v in pairs(enemies) do
        v:update(dt)
    end
end

function Game:mousePos()
    if not love.mouse.isDown("l") then
        return xOldMouse or 0, yOldMouse or 0
    end
    return  (love.mouse.getX() - love.graphics.getWidth()/2)/Scale,
            (love.mouse.getY() - love.graphics.getHeight()/2)/Scale
end

function Game:addScore(score)
    self.score = self.score + score
    self.scoreAnim = 1
end

function Game:load(key)
    if love.touch then
        return love.filesystem.loadKey(key)
    else
        return love.filesystem.read(key .. ".txt")
    end
end

function Game:save(key, val)
    if love.touch then
        love.filesystem.saveKey(key, val)
    else
        love.filesystem.write(key .. ".txt", val)
    end
end

function Game:saveScore()
    if self.score > self.bestscore then
        self.bestscore = self.score
        self:save("score", self.score)
    end
end

function Game:loadScore()
    local num = self:load("score")

    local succ, ret = pcall(tonumber, num)
    if succ and ret then
        self.bestscore = ret
    else
        self.bestscore = 0
    end

    self.bestscore = 0
end

function Game:printOutlined(text, col, outlinedCol, roundness, thickness, x, y, r, sx, sy)
    for i = 1, roundness do
        love.graphics.setColor(outlinedCol.r, outlinedCol.g, outlinedCol.b, outlinedCol.a)
        love.graphics.print(text, x + math.cos(i/(roundness/2) * math.pi)*thickness, y + math.sin(i/(roundness/2) * math.pi)*thickness, r, sx, sy)
    end
    love.graphics.setColor(col.r, col.g, col.b, col.a)
    love.graphics.print(text, x, y, r, sx, sy)
end

function Game:printfOutlined(text, col, outlinedCol, roundness, thickness, x, y, limit, align, r, sx, sy)
    for i = 1, roundness do
        love.graphics.setColor(outlinedCol.r, outlinedCol.g, outlinedCol.b, outlinedCol.a)
        love.graphics.printf(text, x + math.cos(i/(roundness/2) * math.pi)*thickness, y + math.sin(i/(roundness/2) * math.pi)*thickness, limit, align, r, sx, sy)
    end
    love.graphics.setColor(col.r, col.g, col.b, col.a)
    love.graphics.printf(text, x, y, limit, align, r, sx, sy)
end

function Game:draw()
    love.graphics.setBackgroundColor(123, 159, 214)
    love.graphics.setColor(255, 255, 255)

    -- calculate score easing stuff... but why here?
    local scoreScale = 1
    local scoreColor = 0
    if self.scoreAnim > 0 then
        scoreColor = easing.inQuad((1 - self.scoreAnim), 255, -255, 1)
        if scoreColor < 0 then scoreColor = 0 end
        scoreScale = easing.outElastic((1 - self.scoreAnim), 0.6, 0.4, 1)
    end

    love.graphics.push()
    love.graphics.translate(love.graphics.getWidth()/2, love.graphics.getHeight()/2)
    love.graphics.scale(Scale)

        love.graphics.push()
        love.graphics.scale(1.8)
        love.graphics.draw(spriteBackground, -spriteBackground:getWidth()/2, -spriteBackground:getHeight()/2)
        love.graphics.pop()

        local xMouse, yMouse = self:mousePos()
        xDelta = xMouse - xOldMouse
        yDelta = yMouse - yOldMouse

        -- love.graphics.line(xMouse-xDelta, yMouse-yDelta, xMouse, yMouse)

        if self.gameover then
            for k, v in pairs(coins) do
                v:draw()
            end

            for k, v in pairs(bombs) do
                v:draw()
            end

            for k, v in pairs(particles) do
                v:draw()
            end
        end

        if self.score > 0 then
            love.graphics.push()
                love.graphics.setFont(myFont)
                love.graphics.scale(4, 4)

                love.graphics.push()
                    if self.gameover then
                        local t = love.timer.getTime() - self.gameoverTime
                        t = easing.outQuint(t, 0, 1, 1)
                        if t < 1 then
                            love.graphics.scale(1+t*0.1, 1+t*0.1)
                        else
                            love.graphics.scale(1+0.1, 1+0.1)
                        end
                    end

                    love.graphics.translate(-myFont:getWidth(self.score)/2*(scoreScale + 2), 0)
                    self:printOutlined(self.score, {r=255,g=255,b=255}, {r=scoreColor,g=scoreColor,b=scoreColor,a=30*(1+scoreColor/255*5)}, 4, 1, 0, -40, 0, scoreScale + 2, scoreScale + 2)

                love.graphics.pop()
            love.graphics.pop()
        end

        if not self.gameover then
            for k, v in pairs(coins) do
                v:draw()
            end

            for k, v in pairs(bombs) do
                v:draw()
            end

            for k, v in pairs(particles) do
                v:draw()
            end
        end

        ball:draw()

        -- player is out of the screen! draw an indicator for the player
        local xPl, yPl = ball:getPos()
        if yPl < -love.graphics.getHeight()/2/Scale - Ball.radius then
            love.graphics.push()
                love.graphics.setColor(255, 255, 255)
                love.graphics.translate(xPl, -love.graphics.getHeight()/2/Scale + Ball.radius)
                love.graphics.circle("fill", 0, 0, 40, 40)
                local scale = 0.5 - ((-love.graphics.getHeight()/2/Scale - Ball.radius) - yPl)/2000
                if scale < 0.01 then scale = 0.01 end
                love.graphics.scale(scale)
                ball:drawBall()
            love.graphics.pop()
        end

        -- draw the slash animation (for the helping screen)
        if not ball.body:isAwake() then
            love.graphics.setColor(255, 255, 255)
            -- local state = math.floor((math.floor(love.timer.getTime()*20) % 44)/11)
            -- ^ detect when we should alternate
            -- if state == 1 then
            --     spriteSlash:draw(math.floor(love.timer.getTime()*20) % 11, 0, -32*(2.8), -32*(2.8), 0, 6, 6)
            -- elseif state == 3 then
            --     spriteSlash:draw(math.floor(love.timer.getTime()*20) % 11, 0, 32*(2.8), -32*(2.8), 0, -6, 6)
            -- else

                love.graphics.push()
                love.graphics.rotate(math.pi/4)
                spriteSlash:draw(math.floor(love.timer.getTime()*14.7-4) % 11, 0, 32*(2.8), -32*(2.8), 0, -6, 6)
                love.graphics.pop()

                -- love.graphics.setColor(255, 255, 255, easing.inOutQuad(math.min(love.timer.getTime()*2 % 1.5, 1), 0, 255, 1))
                spriteHand:draw(0, 0, -40, 100-easing.inOutQuad(math.min(love.timer.getTime()*2 % 1.5, 1), 0, 150, 1), -1, 3, 3);
                -- love.graphics.setColor(255, 255, 255)

            -- end
        end

        -- draw the trail!
        if #self.trailStack > 0 and not self.gameover then
            local line = {}
            for k, v in pairs(self.trailStack) do
                if not line[#line] or (line[#line-1] ~= v.x and line[#line] ~= v.y) then
                    table.insert(line, v.x)
                    table.insert(line, v.y)
                end
            end
            table.insert(line, xMouse)
            table.insert(line, yMouse)
            love.graphics.setColor(255, 255, 255)
            love.graphics.setLineWidth(20)
            -- love.graphics.line(line)
            love.graphics.setLineWidth(0)
        end

    love.graphics.pop()

    -- draw best score
    love.graphics.push()
    love.graphics.scale(Scale*2, Scale*2)
        love.graphics.setFont(myFont)
        love.graphics.setColor(255, 255, 255)
        local w = myFont:getWidth(self.score)
        local h = myFont:getHeight()

        -- self:printOutlined(self.score, {r=255,g=255,b=255}, {r=scoreColor,g=scoreColor,b=scoreColor,a=30*(1+scoreColor/255*5)}, 4, 1, 2, 1, 0, scoreScale + 2, scoreScale + 2)
        -- self:printOutlined(self.bestscore, {r=255,g=255,b=255}, {r=0,g=0,b=0,a=30}, 4, 1, 2, 10+h*2)
        self:printOutlined(self.bestscore, {r=255,g=255,b=255}, {r=0,g=0,b=0,a=30}, 4, 1, 2, 1)
    love.graphics.pop()

    if self.gameover then
        local w, h = myFont:getWidth("RETRY")*4*Scale, myFont:getHeight()*4*Scale
        local x, y = love.graphics.getWidth()/2 - w/2, love.graphics.getHeight()/2 + h/2 + 100

        love.graphics.setFont(myFont)
        if self.score < 50 then
            self:printfOutlined("YOU ARE\nNOT EVEN TRYING...", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        elseif self.score < 100 then
            -- self:printfOutlined(self.score .. "?!??!?!?", {r=255,g=0,b=0}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 500 * Scale * 3, love.graphics.getHeight()/2 - h/2 - h, 1000 * Scale, "center", 0, 3, 3)
            self:printfOutlined("WOW GREAT SCORE...", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        elseif self.score == 420 then
            self:printfOutlined("ONE DREAM\nONE TEAM\n!!!HASHTAG ODOT!!!", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        elseif self.score < 500 then
            -- self:printfOutlined(self.score .. "?!?", {r=255,g=0,b=0}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 500 * Scale * 3, love.graphics.getHeight()/2 - h/2 - h, 1000 * Scale, "center", 0, 3, 3)
            self:printfOutlined("YOU ARE JUST\nTERRIBLE...", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        elseif self.score < 750 then
            -- self:printfOutlined(self.score .. "?!?", {r=255,g=0,b=0}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 500 * Scale * 3, love.graphics.getHeight()/2 - h/2 - h, 1000 * Scale, "center", 0, 3, 3)
            self:printfOutlined("WHAT KIND OF\nSCORE IS THAT?!", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        elseif self.score < 1000 then
            -- self:printfOutlined(self.score .. "?!?", {r=255,g=0,b=0}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 500 * Scale * 3, love.graphics.getHeight()/2 - h/2 - h, 1000 * Scale, "center", 0, 3, 3)
            self:printfOutlined("NOT VERY GOOD...", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        elseif self.score >= 5000 then
            self:printfOutlined("WOW!!!\nVERY NICE SCORE!!!", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        elseif self.score >= 2000 then
            self:printfOutlined("VERY GOOD SCORE!!!", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        elseif self.score >= 1000 then
            self:printfOutlined("THAT IS\nAN OKAY SCORE!!!", {r=255,g=255,b=255}, {r=0,g=0,b=0,a=200}, 4, 2, love.graphics.getWidth()/2 - 1000 * Scale / 2, love.graphics.getHeight()/2 - h/2, 1000 * Scale, "center", 0, 3, 3)
        end

        -- draw the retry button!!
        local t = 0
        local offset = 0

        if self.pressedRetry then
            -- do a little animation for the button.
            t = (love.timer.getTime() - self.pressedRetryTime)*5
            if t > 1 then t = 1 end
            offset = easing.outBounce(t, 0, 10, 1)

            love.graphics.setColor(200, 35, 35)
        else
            love.graphics.setColor(255, 55, 55)
        end
        love.graphics.rectangle("fill", x-5, y + offset-5, w+6, h+10)
        love.graphics.setColor(255, 255, 255)
        love.graphics.print("RETRY", x, y + offset, 0, 4*Scale, 4*Scale)
    end

    if not ball.body:isAwake() then
        love.graphics.setFont(myFont)
        love.graphics.push()
        love.graphics.translate(love.graphics.getWidth()/2, love.graphics.getHeight()*6/9)
        love.graphics.scale(6, 6)
        love.graphics.setColor(255, 255, 255)
        self:printfOutlined("KEEP\nED\nUP!", {r=255,g=255,b=255}, {r=0,g=50,b=100}, 5, 1, -250, 0, 500, "center")
        love.graphics.pop()
    end

    if DEBUGGING ~= true then return end

    love.graphics.setFont(myFont)
    love.graphics.print("WORK-IN-PROGRESS! EVERYTHING IS SUBJECT TO CHANGE!", 10, love.graphics.getHeight() - 10*2, 0, 2, 2)
    local y = love.graphics.getHeight() - 20*2
    for k, joystick in pairs(love.joystick.getJoysticks()) do
        love.graphics.print(joystick:getName() .. ": " .. table.concat({joystick:getAxes()}, ", "), 10, y, 0, 2, 2)
        y = y - 10*2
    end

    love.graphics.setColor(255, 0, 0, 100)
    love.graphics.rectangle("fill", 5, 5, self.debugForce, 50 * Scale)

    love.graphics.push()
    love.graphics.translate(50*Scale, 50*Scale)
    love.graphics.rotate(self.debugAng)
    love.graphics.rectangle("fill", -20, -5, 41, 10)
    love.graphics.pop()

    love.graphics.setColor(255, 255, 255)

end

function Game:mousepressed(x, y, button)

    local xMouse, yMouse = love.mouse.getPosition()
    xOldMouse, yOldMouse = self:mousePos()


    -- self:spawnParticle(LaserParticle, xOldMouse, yOldMouse, 0)

    local wBox, hBox = boldFont:getWidth("RETRY") + 50*Scale, 32*Scale + 50*Scale
    local xBox, yBox = love.graphics.getWidth()/2 - wBox/2, love.graphics.getHeight()/2 + hBox/2 + 100 - 50*Scale
    -- we just clicked on retry button
    if self.gameover and xMouse > xBox and yMouse > yBox and xMouse <= xBox+wBox and yMouse <= yBox+hBox then
        self.pressedRetry = true
        self.pressedRetryTime = love.timer.getTime()
        love.audio.play(click)
    else
        self.pressedRetry = false

        -- don't update this if we just clicked on retry button
        self.click = love.timer.getTime() -- this detects if we just clicked in game
        -- this is used for when the player taps on the ball instead of swiping.
    end

    self.nextHit = 0
    self.doubleClick = love.timer.getTime()

    local corner
    if math2d.distance(x, y, 0, 0) < 100*Scale then
        corner = 0
    elseif math2d.distance(x, y, love.graphics.getWidth(), 0) < 100*Scale then
        corner = 1
    elseif math2d.distance(x, y, love.graphics.getWidth(), love.graphics.getHeight()) < 100*Scale then
        corner = 2
    elseif math2d.distance(x, y, 0, love.graphics.getHeight()) < 100*Scale then
        corner = 3
    end

    if corner == (self.secretCorner + 1) % 4 then
        self.secretCorner = (self.secretCorner + 1) % 4
        self.secretCount = self.secretCount + 1
    else
        self.secretCorner = 0
        self.secretCount = 0
    end

    if self.secretCount > 8 then
        self:save("score", 0)
        love.keyboard.setTextInput(true)
    end

end

function Game:mousereleased(x, y, button)
    local xMouse, yMouse = love.mouse.getPosition()

    local w, h = boldFont:getWidth("RETRY") + 50*Scale, 32*Scale + 50*Scale
    local x, y = love.graphics.getWidth()/2 - w/2, love.graphics.getHeight()/2 + h/2 + 100 - 50*Scale
    -- we just clicked on retry button
    if self.gameover and xMouse > x and yMouse > y and xMouse <= x+w and yMouse <= y+h and self.pressedRetry then
        self.gameover = false
        self.score = 0

        for k, v in pairs(coins) do
            v:destroy()
        end
        coins = {}

        for k, v in pairs(bombs) do
            v:destroy()
        end
        bombs = {}

        ball:setPos(0, 0)
        ball:setVel(0, 0)
        ball.body:setAwake(false)

        for i = 1, 10 do
            self:spawnCoin()
        end

        self.trailStack = {}
    end

    self.pressedRetry = false
    self.trailStack = {}

    if love.timer.getTime() - self.click < 0.15 then

    end
end

return Game
