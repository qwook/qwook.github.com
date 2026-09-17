time += 1
self.y = 96+sin(time/3)*3
//instance_create(self.x-4,self.y+16,smoke)
for (i=1;i<=13;i+=1)
{
    //newship[i].x -= 4
    if newship[i].x <= -32
    {
        with(newship[i]) {instance_destroy()}
        newship[i]=instance_create(384,-96+(slope-1)*32,slope1)
    }
}
