if start
{
finalcountdown += 1
if produce < finalcountdown
{
    en = instance_create(random_range(-50,50)+100,random_range(-50,50)+200,energy)
    en.speed = 5
    en.direction = finalcountdown
    produce = finalcountdown + 10
}
}
