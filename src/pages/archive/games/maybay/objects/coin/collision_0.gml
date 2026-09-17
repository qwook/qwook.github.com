// [DnD action] fn_name=action_set_score lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=true params=["100"] param_types=[0]
// [DnD action] fn_name=action_if_variable lib_id=1 action_kind=0 exec_type=1 is_condition=true applies_to=-1 invert=false relative=false params=["scored", "0", "0"] param_types=[0, 0, 4]
scored
for (i=1;i<=14;i+=1)
{
    if newship[i].x mod 8 == 0 newship[i].x+=4
    //newship[i].x = round(newship[i].x/8)*8
    /*if newship[i].x < -64
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
        newship[i]=instance_create(420-4*speedc,-96+(slope-1+slopeinv)*32,whichslope)
    }*/
}
