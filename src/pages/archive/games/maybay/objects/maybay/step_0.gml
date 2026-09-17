if speedc != speede speedc = speede
score += 1*speedc
if lives < score lives = score
if speede != 0
{
if mouse_check_button(mb_left) or juston instance_create(self.x-4,self.y+12,smoke)
for (i=1;i<=14;i+=1)
{
    newship[i].x -= 4*speedc
    newship[i].x = round(newship[i].x/(4*speedc))*(4*speedc)
    if newship[i].x <= -64
    {
        with(newship[i]) {instance_destroy()}
        if slope == 4
        {
            if ceil(random(2)) == 1
            {
                slopeinv = 1
                slope -= 1
                whichslope = slope3
            }
            else
            {
                slopeinv = 0
                whichslope = slope1
            }
        }
        else if slope == 1
        {
            if ceil(random(2)) == 1
            {
                slopeinv = -1
                slope += 1
                whichslope = slope2
            }
            else
            {
                slopeinv = 0
                whichslope = slope1
            }
        }
        else
        {
            rnd = ceil(random(3))
            if rnd == 1
            {
                slopeinv = 0
                whichslope = slope1
            }
            else if rnd == 2
            {
                slopeinv = -1
                slope += 1
                whichslope = slope2
            }
            else if rnd == 3
            {
                slopeinv = 1
                slope -= 1
                whichslope = slope3
            }
        }
        newship[i]=instance_create(384,-96+(slope-1+slopeinv)*32,whichslope)
    }
}
for (i=1;i<=5;i+=1)
{
    cloud1_inst[i].x -= 2*speedc
    if cloud1_inst[i].x < -141
    {
        cloud1_inst[i].x = 568
    }
    cloud2_inst[i].x -= 1*speedc
    if cloud2_inst[i].x < -141
    {
        cloud2_inst[i].x = 568
    }
}
block_inst.x -= 4*speedc
if block_inst.x <= -32 and whichslope == slope1
{
    with(block_inst) {instance_destroy()}
    if ceil(random(2))==1
    {
        block_inst = instance_create(416,32+(32*slope),coin)
    }
    else
    {
        block_inst = instance_create(416,32+(32*slope),block)
    }
}
skity1.x -= 0.1*speedc
if skity1.x <= -56
{
    skity1.x = 384
}
}
