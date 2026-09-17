
local math2d = {}

function math2d.dotproduct(x1, y1, z1, x2, y2, z2)
    return x1*x2 + y1*y2 + z1*z2
end

function math2d.crossproduct(x1, y1, z1, x2, y2, z2)
    return y1*z2 - y2*z1, z1*x2 - z2*x1, x1*y2 - x2*y1
end

function math2d.length(x, y)
    return math.sqrt(x*x + y*y)
end

function math2d.length3d(x, y, z)
    return math.sqrt(x*x + y*y + z*z)
end

function math2d.distance(x, y, x2, y2)
    return math2d.length(x2-x, y2-y)
end

function math2d.distance3d(x, y, z, x2, y2, z2)
    return math2d.length3d(x2-x, y2-y, z2 - z)
end

function math2d.normal(x, y)
    local len = math2d.length(x, y)
    return x / len, y / len
end

function math2d.normal3d(x, y, z)
    local len = math2d.length3d(x, y, z)
    return x / len, y / len, z / len
end

function math2d.angle(x, y, x2, y2)
    local dot = math2d.dotproduct(x, y, 0, x2, y2, 0)
    local product = math2d.length(x, y) * math2d.length(x2, y2)
    return math.acos(dot / product)
end

function math2d.angle3d(x, y, z, x2, y2, z2)
    local dot = math2d.dotproduct(x, y, z, x2, y2, z2)
    local product = math2d.length3d(x, y, z) * math2d.length3d(x2, y2, z2)
    return math.acos(dot / product)
end

function math2d.angleForward(p, y, r)
    local x = math.cos(r) * math.cos(y)
    local y = math.sin(p) * math.cos(y)
    local z = -math.sin(y)

    x, y, z = math2d.normal3d(x, y, z)

    return x, y, z
end

function math2d.angleUp(p, y, r)
    local x = -math.sin(r) * math.cos(p) + math.cos(r) * math.sin(y) * math.sin(p)
    local y = math.cos(r) * math.cos(p) + math.sin(r) * math.sin(y) * math.sin(p)
    local z = math.cos(y) * math.sin(p)

    x, y, z = math2d.normal3d(x, y, z)

    return x, y, z
end

function math2d.angleRight(p, y, r)
    local x = math.sin(r) * math.sin(p) + math.cos(r) * math.sin(y) * math.cos(p)
    local y = -math.cos(r) * math.sin(p) + math.sin(r) * math.sin(y) * math.cos(p)
    local z = math.cos(y) * math.cos(p)

    x, y, z = math2d.normal3d(x, y, z)

    return x, y, z
end

function math.sign(n)
    if n < 0 then return -1 end
    if n > 0 then return 1 end
    return 0
end

return math2d
