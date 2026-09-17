alpha = 1
lastlastrand = 1
lastrand = 1
time = 0
speedx = 0
speedy = 0
health = 190
finalcountdown = 0
produce = 0
start = false
for(i=1;i<500;i+=1)
{
smokepart[i,1] = self.x + random_range(-5,5)
smokepart[i,2] = self.y + random_range(-5,5)
smokepart[i,3] = i
smokepart[i,4] = round(random_range(0,5))
}
