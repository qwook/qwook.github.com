// [DnD action] fn_name=action_color lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["12632256"] param_types=[13]
// [DnD action] fn_name=action_font lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["-1", "0"] param_types=[12, 4]
time += 1
// [DnD action] fn_name=action_if_variable lib_id=1 action_kind=0 exec_type=1 is_condition=true applies_to=-1 invert=false relative=false params=["start", "true", "0"] param_types=[0, 0, 4]
// [DnD action] fn_name= lib_id=1 action_kind=1 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
draw_set_color(c_navy)
//draw_line_width(100,200,self.x,self.y,3)
for (i=1; i<50; i+=1)
{
    if (smokepart[i,3] > 0)
    {
        if smokepart[i,4] == 1
        {
            draw_set_color(c_blue)
            smokepart[i,1] += 0.25
            smokepart[i,2] += 0.25
        }
        if smokepart[i,4] == 2
        {
            draw_set_color(c_aqua)
            smokepart[i,1] += 0.25
            smokepart[i,2] -= 0.25
        }
        if smokepart[i,4] == 3
        {
            draw_set_color(c_dkgray)
            smokepart[i,1] -= 0.25
            smokepart[i,2] -= 0.25
        }
        if smokepart[i,4] == 4
        {
            draw_set_color(c_gray)
            smokepart[i,1] -= 0.25
            smokepart[i,2] += 0.25
        }
        if smokepart[i,4] == 5
        {
            draw_set_color(c_ltgray)
            smokepart[i,1] -= 0.25
            smokepart[i,2] += 0.25
        }
        draw_rectangle(smokepart[i,1]+0,smokepart[i,2]+0,smokepart[i,1]+5,smokepart[i,2]+5,false)
        smokepart[i,3] -= 1
    } else {
        smokepart[i,1] = self.x + random_range(-5,5)
        smokepart[i,2] = self.y + random_range(-5,5)
        smokepart[i,3] = 5
    }
}
draw_sprite(player,false,self.x,self.y-sin(time/2))
draw_set_color(c_fuchsia)
draw_set_alpha(1)
draw_rectangle(5,25,health+5,35,false)
draw_set_color(c_lime)
draw_set_alpha(health/190)
draw_rectangle(5,25,health+5,35,false)
draw_set_alpha(1)
// [DnD action] fn_name= lib_id=1 action_kind=2 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name= lib_id=1 action_kind=3 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name= lib_id=1 action_kind=1 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
draw_set_color(c_black)
draw_set_alpha(0.75)
draw_rectangle(0,0,200,400,false)
draw_set_color(c_white)
draw_set_font(title)
draw_set_alpha(1)
draw_text(0,0,"high")
draw_set_font(instructions)
draw_sprite(energyball,false,73,70)
draw_text(5,35,"meet smoke.")
draw_text(5,45,"the genetically enhanced weed.")
draw_text(5,65,"collect        for fuel.")
draw_text(5,85,"you will constantly lose fuel.")
draw_text(5,95,"w - forward")
draw_text(5,105,"s - backwards")
draw_text(5,115,"a - left")
draw_text(5,125,"d - right")
draw_text(5,135,"q - toggle music")
draw_text(5,145,"esc - quit game")
draw_text(40,380,"press")
draw_text(73,380-sin(time/4)*4,"E")
draw_text(80,380-sin(time/4+1)*4,"N")
draw_text(87,380-sin(time/4+2)*4,"T")
draw_text(94,380-sin(time/4+3)*4,"E")
draw_text(101,380-sin(time/4+4)*4,"R")
draw_text(110,380,"to start")
draw_sprite(player,false,100,200-sin(time/2))
// [DnD action] fn_name=action_if_score lib_id=1 action_kind=0 exec_type=1 is_condition=true applies_to=-1 invert=false relative=false params=["0", "2"] param_types=[0, 4]
// [DnD action] fn_name= lib_id=1 action_kind=1 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name=action_color lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["16777215"] param_types=[13]
// [DnD action] fn_name=action_font lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["0", "1"] param_types=[12, 4]
// [DnD action] fn_name=action_draw_score lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["100", "300", "score: "] param_types=[0, 0, 1]
// [DnD action] fn_name=action_font lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["1", "1"] param_types=[12, 4]
// [DnD action] fn_name=action_draw_text lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["game over", "100", "270"] param_types=[2, 0, 0]
// [DnD action] fn_name= lib_id=1 action_kind=2 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name= lib_id=1 action_kind=2 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name=action_if_variable lib_id=1 action_kind=0 exec_type=1 is_condition=true applies_to=-1 invert=false relative=false params=["start", "true", "0"] param_types=[0, 0, 4]
// [DnD action] fn_name= lib_id=1 action_kind=1 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name=action_color lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["16777215"] param_types=[13]
// [DnD action] fn_name=action_font lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["0", "0"] param_types=[12, 4]
// [DnD action] fn_name=action_draw_score lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["0", "0", ""] param_types=[0, 0, 1]
// [DnD action] fn_name= lib_id=1 action_kind=2 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
