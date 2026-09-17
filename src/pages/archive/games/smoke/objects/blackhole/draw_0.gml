alpha += 0.01
if alpha >= 1
{
rand = round(random_range(1,5))
lastlastrand = lastrand
lastrand = rand
alpha = 0
} else {
rand = lastrand
}
randa = lastlastrand
if randa == 1
{
    draw_set_color(c_fuchsia)
}
if randa == 2
{
    draw_set_color(c_lime)
}
if randa == 3
{
    draw_set_color(c_purple)
}
if randa == 4
{
    draw_set_color(c_black)
}
if randa == 5
{
    draw_set_color(c_white)
}
draw_set_alpha(1)
draw_rectangle(0,0,200,400,false)

if rand == 1
{
    draw_set_color(c_fuchsia)
}
if rand == 2
{
    draw_set_color(c_lime)
}
if rand == 3
{
    draw_set_color(c_purple)
}
if rand == 4
{
    draw_set_color(c_black)
}
if rand == 5
{
    draw_set_color(c_white)
}
draw_set_alpha(alpha)
draw_rectangle(0,0,200,400,false)
time += 1

for (i=1; i<500; i+=1)
{
    if (smokepart[i,3] > 0)
    {
        if smokepart[i,4] == 1
        {
            draw_set_color(c_fuchsia)
        }
        if smokepart[i,4] == 2
        {
            draw_set_color(c_lime)
        }
        if smokepart[i,4] == 3
        {
            draw_set_color(c_purple)
        }
        if smokepart[i,4] == 4
        {
            draw_set_color(c_black)
        }
        if smokepart[i,4] == 5
        {
            draw_set_color(c_white)
        }
        smokepart[i,1] = cos((time-i)/10)*(500-smokepart[i,3])+self.x
        smokepart[i,2] = sin((time-i)/10)*(500-smokepart[i,3])+self.y
        draw_rectangle(smokepart[i,1]+0,smokepart[i,2]+0,smokepart[i,1]+(500-smokepart[i,3])/5+5,smokepart[i,2]+(500-smokepart[i,3])/5+5,false)
        draw_set_alpha(smokepart[i,3])
        smokepart[i,3] -= 1
    } else {
        smokepart[i,1] = self.x + random_range(-5,5)
        smokepart[i,2] = self.y + random_range(-5,5)
        smokepart[i,3] = 500
    }
}
