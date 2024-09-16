# Expense-Manager

## To-do

### Client

- [ ] Particular expense page leads to create/edit expense(disabled button for now)
- [x] Create a group page 
- [x] Create an expense page 
- [x] Create balances page
- [ ] Settings page
- [ ] advanced split feature of expenses allowing user to add small expenses in the users field ('100+200' showing the answer 300 directly)
- [ ] add by url option
- [x] share url option 
- [ ] A landing page
- [x] reverse the - and + in balances page
- [ ] adding a slider for expense amount(for nibba)

#### ASAP

- [x] delete group locally dropdown not closing when clicked on the button itself
- [x] adjust theme settings on settings page as well
- [x] save changes and delete button stuck to each other
- [x] when hovering on dropdown it should not trigger hover on group itself
- [ ] select/deselect user not working in add expense
- [x] share url not working on mobile
- [x] if group deleted it needs to be removed from localstorage for all users
- [x] edgecase of paid_by user does not take part in payment(user is not added to   expense_participants) 
- [x] group name re-rendering everytime tab switches, need it to be there as long as user is inside group and browsing 
- [ ] moving navlinks to the right most corner
- [x] settings page
- [x] create drop down for add group by url


### Server

- [x] Create an expense with group and participants
- [x] Create a group and members
- [x] update group making to include user creation inside it
- [x] delete group
- [x] include delete api calls  
- [ ] include update api calls
- [ ] returning the list-by-group needs to return name for paid_by instead of id
- [ ] expense title in expenses table
