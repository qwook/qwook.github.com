slope = 2
time = 0
for (i=1;i<=13;i+=1)
{
    newship[i]=instance_create((i-1)*32,-64,slope1)
}
// [DnD action] fn_name=action_end_sound lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["1"] param_types=[6]
