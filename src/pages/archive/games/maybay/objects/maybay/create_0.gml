juston = 1
score = 0
slope = 2
isslope = 0 // deprecated
speede = 1
speedc = 1
whichslope = slope1
block_inst = instance_create(384,64,block)
skity1 = instance_create(384,48,skycity1)
for (i=1;i<=14;i+=1)
{
    newship[i]=instance_create((i-1)*32,-64,slope1)
}
for (i=1;i<=5;i+=1)
{
    cloud1_inst[i]=instance_create((i-1)*142,256,movingcloud1)
    cloud2_inst[i]=instance_create((i-1)*142,256,movingcloud2)
}
// [DnD action] fn_name=action_set_gravity lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["90", "0.25*speedc"] param_types=[0, 0]
image_speed
// [DnD action] fn_name=action_set_caption lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["0", "score: ", "0", "lives: ", "0", "health: "] param_types=[4, 1, 4, 1, 4, 1]
// [DnD action] fn_name=action_sound lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["1", "1"] param_types=[6, 3]
