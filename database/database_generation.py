from random import *
from csv import writer
from datetime import *
# from time import *

employees = [1,2,3,4,5]
ingredients = ["Buns","Lettuce","patty","cheese","bacon","bread","tomato","crispy chicken","spicy crispy chicken","grilled chicken","croutons","fries","small cup","large cup","cookie","chicken tender","corn dog","hot dog bun","hot dog bun","wiener","tortilla","salsa","ice cream","whipped cream","ribs","pickles","onions","napkin","cup lid","straw","tray","ice cream bowl","shake cup","salad bowl"]
menu_items = {
    "Bacon Cheeseburger":["Buns","patty","cheese","bacon","tray","napkin"],
    "Cheeseburger":["Buns","patty","cheese","tray","napkin"],
    "Patty Melt":["bread","patty","cheese","tray","napkin"],
    "Hamburger":["Buns","patty","Lettuce","tomato","tray","napkin"],
    "Aggie Chicken Club":["Buns","crispy chicken","Lettuce","bacon","tray","napkin"],
    "Revs Grilled Chicken Sandwich":["Buns","grilled chicken","Lettuce","tomato","tray","napkin"],
    "Spicy Chicken Sandwich":["Buns","spicy crispy chicken","Lettuce","tray","napkin"],
    "Chicken Caesar Salad":["grilled chicken","Lettuce","Lettuce","Lettuce","croutons","salad bowl","napkin"],
    "French Fries":["fries","tray","napkin"],
    "Small Drink":["small cup","cup lid","straw"],
    "Large Drink":["large cup","cup lid","straw"],
    "Cookies":["cookie","cookie","tray","napkin"],
    "Chicken Tenders":["chicken tender","tray","napkin"],
    "Corn Dogs":["corn dog","corn dog","tray","napkin"],
    "Hot Dogs":["hot dog bun","hot dog bun","wiener","wiener","tray","napkin"],
    "Chicken Wrap":["tortilla","grilled chicken","salsa","Lettuce","tray","napkin"],
    "Double Scoop Ice Cream":["ice cream","ice cream","ice cream bowl"],
    "Aggie Shake":["ice cream","whipped cream","shake cup","straw"],
    "Cookie Ice Cream Melt":["cookie","cookie","ice cream","tray","napkin"],
    "Yell BBQ Rib Sandwich":["ribs","onions","pickles","tray","napkin"],
    "BLT Burger":["Buns","patty","bacon","Lettuce","tomato","tray","napkin"],
    "Double Cheeseburger":["Buns","patty","patty","cheese","tray","napkin"]
}
menu_item_costs = {
    "Bacon Cheeseburger":8.65,
    "Cheeseburger":7.45,
    "Patty Melt":5.45,
    "Hamburger":8.45,
    "Aggie Chicken Club":6.75,
    "Revs Grilled Chicken Sandwich":6.60,
    "Spicy Chicken Sandwich":6.30,
    "Chicken Caesar Salad":6.80,
    "French Fries":3.50,
    "Small Drink": 1.50,
    "Large Drink": 2.50,
    "Cookies":2.00,
    "Chicken Tenders":5.60,
    "Corn Dogs":4.45,
    "Hot Dogs":5.75,
    "Chicken Wrap":6.45,
    "Double Scoop Ice Cream":4.25,
    "Aggie Shake":4.50,
    "Cookie Ice Cream Melt":5.25,
    "Yell BBQ Rib Sandwich":7.30,
    "BLT Burger":9.25,
    "Double Cheeseburger":8.45
}
menu_item_categories = {
    "Bacon Cheeseburger":"burgers",
    "Cheeseburger":"burgers",
    "Patty Melt":"burgers",
    "Hamburger":"burgers",
    "Aggie Chicken Club":"sandwiches",
    "Revs Grilled Chicken Sandwich":"sandwiches",
    "Spicy Chicken Sandwich":"sandwiches",
    "Chicken Caesar Salad":"entrees",
    "French Fries":"sides",
    "Small Drink": "drinks",
    "Large Drink": "drinks",
    "Cookies":"desserts",
    "Chicken Tenders":"entrees",
    "Corn Dogs":"entrees",
    "Hot Dogs":"entrees",
    "Chicken Wrap":"entrees",
    "Double Scoop Ice Cream":"desserts",
    "Aggie Shake":"desserts",
    "Cookie Ice Cream Melt":"desserts",
    "Yell BBQ Rib Sandwich":"sandwiches",
    "BLT Burger":"burgers",
    "Double Cheeseburger":"burgers"
}
menu_item_descriptions = {
    "Bacon Cheeseburger": "A succulent beef patty topped with crispy bacon strips and melted cheese, served on a soft bun.",
    "Cheeseburger": "Classic grilled beef patty paired with a slice of creamy cheese, tucked in a toasted bun.",
    "Patty Melt": "Grilled beef patty with melted cheese between slices of golden-brown bread.",
    "Hamburger": "Simple yet delicious, this burger comes with a juicy beef patty, fresh lettuce, and ripe tomato.",
    "Aggie Chicken Club": "Crispy chicken, fresh lettuce, and smoky bacon stacked in a toasted bun.",
    "Revs Grilled Chicken Sandwich": "Tender grilled chicken breast with lettuce and tomato, served on a toasted bun.",
    "Spicy Chicken Sandwich": "Spicy fried chicken with crisp lettuce on a toasted bun for those who like it hot.",
    "Chicken Caesar Salad": "Chopped romaine lettuce, grilled chicken, croutons, and Parmesan cheese, all tossed in Caesar dressing.",
    "French Fries": "Golden and crispy on the outside, soft on the inside – the perfect side to any meal.",
    "Small Drink": "Your choice of any soft drink in a small cup.",
    "Large Drink": "Your choice of any soft drink in a large cup, for those extra thirsty moments.",
    "Cookies": "Two freshly baked Cookies, soft in the middle with a slight crunch on the outside.",
    "Chicken Tenders": "Crispy on the outside, juicy on the inside, these Chicken Tenders are a crowd pleaser.",
    "Corn Dogs": "Two classic Corn Dogs, deep-fried to golden perfection.",
    "Hot Dogs": "Twin beef wieners in soft buns, a simple pleasure for any meal.",
    "Chicken Wrap": "Grilled chicken wrapped in a soft tortilla with salsa and lettuce, for a light yet flavorful meal.",
    "Double Scoop Ice Cream": "Two generous scoops of creamy ice cream, choose your favorite flavor.",
    "Aggie Shake": "A thick and creamy shake topped with whipped cream, perfect for dessert or a treat.",
    "Cookie Ice Cream Melt": "Warm Cookies served with a scoop of vanilla ice cream, a heavenly combination.",
    "Yell BBQ Rib Sandwich": "BBQ ribs, caramelized onions, and pickles in a bun, for a tangy and sweet experience.",
    "BLT Burger": "A beef patty with crispy bacon, fresh lettuce, and tomato, a classic favorite.",
    "Double Cheeseburger": "Double the beef, double the cheese, for when you’re feeling extra hungry."
}
menu_item_calories = {
    "Bacon Cheeseburger": 800,  
    "Cheeseburger": 600,
    "Patty Melt": 700,
    "Hamburger": 500,
    "Aggie Chicken Club": 750,
    "Revs Grilled Chicken Sandwich": 550,
    "Spicy Chicken Sandwich": 650,
    "Chicken Caesar Salad": 400,
    "French Fries": 300,
    "Small Drink": 150,
    "Large Drink": 250,
    "Cookies": 160,  
    "Chicken Tenders": 470,
    "Corn Dogs": 220, 
    "Hot Dogs": 500,  
    "Chicken Wrap": 600,
    "Double Scoop Ice Cream": 450,
    "Aggie Shake": 550,
    "Cookie Ice Cream Melt": 700,
    "Yell BBQ Rib Sandwich": 900,
    "BLT Burger": 800,
    "Double Cheeseburger": 900
}
ing_item_costs = {
    "Buns": .30,
    "Lettuce": .25,
    "patty": 1.50,
    "cheese": .40,
    "bacon": .50,
    "bread": .20,
    "tomato": .40,
    "crispy chicken": .75,
    "spicy crispy chicken": .85,
    "grilled chicken": .75,
    "croutons": .10,
    "fries": 1.20,
    "small cup": .05,
    "large cup": .08,
    "cookie": .25,
    "chicken tender": .80,
    "corn dog": 1.10,
    "hot dog bun": .25,
    "wiener":.75,
    "tortilla":.10,
    "salsa":.05,
    "ice cream":.75,
    "whipped cream":.25,
    "ribs":1.50,
    "pickles":.20,
    "onions":.20,
    "napkin":.02,
    "cup lid":.10,
    "straw":.05,
    "tray":.05,
    "ice cream bowl":.20,
    "shake cup":.23,
    "salad bowl":.18
}


menu_file = open("menu_items.csv","w",newline="")
menu_csv = writer(menu_file)
menu_id = 1
menu_csv.writerow(["id","name","available","price","category"])
menu_item_ids = {}
for x in menu_items:
    menu_csv.writerow([menu_id,x,"true",format(menu_item_costs[x],".2f"),menu_item_categories[x]
                      ,menu_item_descriptions[x],menu_item_calories[x]])
    menu_item_ids[x] = menu_id
    menu_id += 1
menu_file.close()

inventory_count = {}
for item in menu_items:
    for ing in menu_items[item]:
        if ing in inventory_count:
            inventory_count[ing] += 1
        else:
            inventory_count[ing] = 1
for ing in inventory_count:
    inventory_count[ing] *= 400

item_file = open("inventory_items.csv","w",newline="")
item_csv = writer(item_file)
item_id = 1
item_ids = {}
item_csv.writerow(["id","item_name","stock","price","max_stock"])
for x in ingredients:
    stock = inventory_count[x]
    item_csv.writerow([item_id,x,stock,format(ing_item_costs[x],".2f"),round(stock / 50.0) * 50])
    item_ids[x] = item_id
    item_id += 1
item_file.close()

ingredients_file = open("ingredients.csv","w",newline="")
ingr_csv = writer(ingredients_file)
ingr_id = 1
ingr_csv.writerow(["id","item_id","menu_id","num"])
for x in menu_items:
    ing_count = {}
    for ing in menu_items[x]:
        if ing in ing_count:
            ing_count[ing] += 1
        else:
            ing_count[ing] = 1
    for ing in ing_count:
        ingr_csv.writerow([ingr_id,item_ids[ing],menu_item_ids[x],ing_count[ing]])
        ingr_id += 1



available_times = []
curr_time = datetime(year=2023,month=1,day=1,hour=10,minute=30,second=0)
lunch_end = datetime(year=2023,month=1,day=1,hour=13,minute=30,second=0)
dinner_begin = datetime(year=2023,month=1,day=1,hour=18,minute=30,second=0)
dinner_end = datetime(year=2023,month=1,day=1,hour=20,minute=30,second=0)
closing_time = datetime(year=2023,month=1,day=1,hour=22,minute=30,second=0)
inc = timedelta(seconds=1)


while curr_time < closing_time:
    available_times.append(curr_time.time())
    if curr_time < lunch_end:
        curr_time = curr_time + inc
    elif curr_time < dinner_begin:
        curr_time = curr_time + inc*5
    elif curr_time < dinner_end:
        curr_time = curr_time + inc
    else:
        curr_time = curr_time + inc*3

ingredients_file.close()
day1 = date(2023,1,1)
peak_day_1 = date(2023,8,randrange(27,30))
peak_day_2 = date(2024,1,randrange(15,20))
inc = timedelta(days=1)

multipliers = [1.3,1.7,2.4,3.5,4.2,2.6,1]
num_items = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,4]
avail_emp = [1,2,2,2,3,3,3,4,4,4,5,5]

sales_file = open("sales_transactions.csv","w",newline="")
sales_csv = writer(sales_file)
sales_id = 1
sales_csv.writerow(["id","cost","employee_id","purchase_time"])

sale_item_file = open("sales_items.csv","w",newline="")
sale_item_csv = writer(sale_item_file)
sale_item_id = 1
sale_item_csv.writerow(["id","sales_id","menu_id"])

inventory_trans_file = open("inventory_transactions.csv","w",newline="")
inv_trans_csv = writer(inventory_trans_file)
inv_trans_id = 1
inv_trans_csv.writerow(["id","manager_id","transaction_date","price"])

inventory_item_file = open("inventory_item_orders.csv","w",newline="")
inv_item_csv = writer(inventory_item_file)
inv_item_id = 1
inv_item_csv.writerow(["id","transaction_id","item_id","stock","price"])

''' for reference of inventory size
inventory_count = {}
for item in menu_items:
    for ing in menu_items[item]:
        if ing in inventory_count:
            inventory_count[ing] += 1
        else:
            inventory_count[ing] = 1
for ing in inventory_count:
    inventory_count[ing] *= 400
'''

curr_inventory = inventory_count.copy()
num_days = (date(2024,2,21) - day1).days
#print(num_days)
#exit()
#for i in range(randrange(366,415,7)):
for i in range(num_days):
    day = day1 + (inc)*i
    multi = multipliers[day.weekday()]
    if day == peak_day_1:
        multi = 10.4
    if day == peak_day_2:
        multi = 9.2
    num_orders = randrange(int(150*multi),int(250*multi))
    times = sample(available_times,num_orders)
    for t in times:
        emp_id = choice(avail_emp)
        num = choice(num_items)
        cost = 0
        for j in range(num):
            item = choice(list(menu_items.keys()))
            for ing in menu_items[item]:
                curr_inventory[ing] -= 1
            cost += menu_item_costs[item]
            sale_item_csv.writerow([sale_item_id,sales_id,menu_item_ids[item]])
            sale_item_id += 1
        sale_time = datetime.combine(day,t)
        sales_csv.writerow([sales_id,format(cost,".2f"),emp_id,sale_time.strftime("%Y-%m-%d %H:%M:%S")])
        sales_id += 1
    
    if day.weekday() == 3 or day.weekday() == 6:
        restock = {}
        stock_time = time(hour=22,minute=randrange(35,60),second=randrange(0,60))
        stock_time = datetime.combine(day,stock_time)
        for item in curr_inventory:
            restock[item] = inventory_count[item] - curr_inventory[item]
        price = 0
        for item in restock:
            cost = ing_item_costs[item]*restock[item]
            price += cost
            inv_item_csv.writerow([inv_item_id,inv_trans_id,item_ids[item],restock[item],cost])
            inv_item_id += 1
        # the only manager has id = 1
        inv_trans_csv.writerow([inv_trans_id,1,stock_time.strftime("%Y-%m-%d %H:%M:%S"),format(price,".2f")])
        curr_inventory = inventory_count.copy()
        inv_trans_id += 1
        
sales_file.close()
sale_item_file.close()
inventory_trans_file.close()
inventory_item_file.close()