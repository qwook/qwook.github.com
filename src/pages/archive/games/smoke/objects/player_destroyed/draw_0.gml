time += 1
if time < 20
{
rand = round(random_range(1,3))
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
    draw_set_color(c_blue)
    }
    draw_rectangle(self.x+(time*3)-(20-time),self.y+(time*3)-(20-time),self.x+(time*3)+(20-time),self.y+(time*3)+(20-time),false)
    draw_rectangle(self.x-(time*3)-(20-time),self.y+(time*3)-(20-time),self.x-(time*3)+(20-time),self.y+(time*3)+(20-time),false)
    draw_rectangle(self.x+(time*3)-(20-time),self.y-(time*3)-(20-time),self.x+(time*3)-(20-time),self.y-(time*3)-(20-time),false)
    draw_rectangle(self.x-(time*3)-(20-time),self.y-(time*3)-(20-time),self.x-(time*3)+(20-time),self.y-(time*3)+(20-time),false)
} else {
    instance_destroy()
}
