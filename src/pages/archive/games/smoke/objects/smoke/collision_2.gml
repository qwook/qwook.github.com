// [DnD action] fn_name=action_kill_object lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-2 invert=false relative=false params=[] param_types=[]
if start
{
togive = round(random_range(5,30))
if health + togive < 190
{
    healthtobe = healthtobe + togive
} else {
    healthtobe = 190
}
sound_play(s_energy)
score += 50
}
/*rand = round(random_range(1,3))
if rand == 1
    sound_play(collect1)
if rand == 2
    sound_play(collect2)
if rand == 3
    sound_play(collect3)
if rand == 4*/
