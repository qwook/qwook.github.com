// [DnD action] fn_name=action_set_caption lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["0", "score: ", "0", "lives: ", "0", "health: "] param_types=[4, 1, 4, 1, 4, 1]
time = 0
speedx = 0
speedy = 0
health = 190
healthtobe = 190
start = false
score = 0
soundon = true
for(i=1;i<50;i+=1)
{
smokepart[i,1] = self.x + random_range(-5,5)
smokepart[i,2] = self.y + random_range(-5,5)
smokepart[i,3] = i
smokepart[i,4] = round(random_range(0,5))
}
// [DnD action] fn_name=action_sound lib_id=1 action_kind=0 exec_type=1 is_condition=false applies_to=-1 invert=false relative=false params=["7", "1"] param_types=[6, 3]
