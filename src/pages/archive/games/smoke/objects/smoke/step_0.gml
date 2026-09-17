if start
{
//distance = sqrt((100-self.x)^2+(200-self.y)^2)
if self.x > 100
{
    speedx -= (self.x-100)/800
}
if self.x < 100
{
    speedx += (100-self.x)/800
}
if self.y > 200
{
    speedy -= (self.y-200)/800
}
if self.y < 200
{
    speedy += (200-self.y)/800
}
self.x += speedx
self.y += speedy
if healthtobe > health
{
    health += 1
} else {
    health -= 1
    healthtobe = health
}
score += 1
}
// [DnD action] fn_name=action_if_health lib_id=1 action_kind=0 exec_type=1 is_condition=true applies_to=-1 invert=false relative=false params=["1", "1"] param_types=[0, 4]
// [DnD action] fn_name= lib_id=1 action_kind=1 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name=action_create_object lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=true params=["7", "0", "0"] param_types=[10, 0, 0]
// [DnD action] fn_name=action_move_start lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
start
start
speedx
speedy
// [DnD action] fn_name=action_kill_object lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=2 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name=action_set_health lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["190"] param_types=[0]
// [DnD action] fn_name=action_if_variable lib_id=1 action_kind=0 exec_type=1 is_condition=true applies_to=-1 invert=false relative=false params=["soundon", "true", "0"] param_types=[0, 0, 4]
// [DnD action] fn_name= lib_id=1 action_kind=1 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name=action_sound lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["5", "0"] param_types=[6, 3]
// [DnD action] fn_name= lib_id=1 action_kind=2 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
// [DnD action] fn_name= lib_id=1 action_kind=2 exec_type=0 is_condition=false applies_to=-1 invert=false relative=false params=[] param_types=[]
