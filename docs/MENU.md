# Menu configuration

Configure the menu data in the '/src/menus.js' file, and load the menu data hard-coded or asynchronously on the front-end.

## Menu features

In order to simplify development and allow development to focus on business logic, the system encapsulates the menu somewhat.

- The menu supports head, left, head + left **three layout methods**，See[Navigation layout](LAYOUT.md)；
- The system will automatically select the corresponding menu based on the route path;
- The secondary page corresponding to the no menu can also **select the corresponding parent** menu,See[System routing](ROUTE.md)；
- The left menu will automatically scroll into view;
- The left menu supports**Expand and collapse**;
- Page titles, tab titles, and breadcrumbs are automatically generated based on menu status, but they also provide corresponding modifications.See[Page development](PAGE.md)；
- Through the menu configuration, it supports embedding **iframe** to open third-party pages, **A tab** to open third-party pages;

## Menu field description

Developers can configure the required fields according to their needs.

Field|Required|Description
---|---|---
id      |Yes|need to be unique
parentId|No |Used to associate a parent
path    |Yes|The routing address of the menu or the address of the third-party website
title   |Yes|Menu title
icon    |No |Menu icon configuration
target  |No |When used with URLs, the menu will be a label `<a href={path} target={target}>{title}</a>`
order   |No |The menu is sorted, and the higher the value, the higher the display
