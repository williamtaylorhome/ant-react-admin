# Code generation tools
In order to facilitate development, the system provides a code generation tool based on configuration (page) + template, which can quickly generate relevant code for addition, deletion, modification and search.

## characteristic
1. Based on text profiles, simple and straightforward;
1. Code can be generated in a variety of ways based on swagger documents, databases, and configuration files;
1. Based on the template, the generated code is of high quality and it is easy to extend the template we need;

## Directions for use
Based on the default profile /script/gen/config.conf Do code generation
```bash
$ yarn gen
```

Specify the profile
```bash
$ yarn gen ./my-confog.conf
```

Ignore the file overwrite prompt
```bash
$ yarn gen -y
```

Based on database tables, it can be quickly generated
```bash
$ yarn gen -t users
```

## Instructions for writing configuration files
Configuration files are read through custom scripts and need to follow some simple writing rules

1. The script reads the text content of the file, and the configuration file can be of any type;
1. The script splits each configuration item by space, and the number of spaces is not limited.
1. \#\#\#\#\#\# The content wrapped in (six # numbers) is used to distinguish the configuration module, do not change it at will, and the order of the configuration block can be adjusted at will；
1.The priority of obtaining the configuration is as follows: interface > database table > current configuration file.
1. If the URL line in the interface configuration is commented out, it will not be generated based on the interface.
1. In the database configuration, the table name row is commented out, and it is not generated based on the database table；
1. Three annotation methods # ; //,Code comments can be made in either way based on requirements；

### Form Element Keyword Description: 
1. q: as a query condition(query) ；
1. f: as a form(form)；
1. r: Required；
1. 5: Individual digits, maximum input length;
1. Types of forms are available：
    1. input hidden number textarea password mobile email
    1. select select-tree checkbox checkbox-group radio radio-group switch
    1. date time date-time date-range cascader icon-picker

### Databases are linked
```
mysql://user:password@host:port/database?querystring
```
### Description of the address of the Ajax request
1. Request keywords: query, modify, add, delete, detail, batch delete;
1. Various: Request type method url dataPath（Obtain the key of the interface data eg: data.list）；
1. When a page is generated based on an API:
    1. The specific address is filled in the Basic Configuration.
    1. Obtain query conditions and header information through the "Query" interface;
    1. Get the form information through the "Modify" interface;
    1.Requests that are not filled in will be generated based on the "query" or "directory" RESTful style;

### Page type configuration
1. List page, pop-up box editing, page editing The default template and file name of the system can be left unspecified.
1. Custom Pages:
    1. You need to specify both the template and the target file name, for example：Customize the page ./src/template.js->customer.jsx；
    1. The template path starts from the root directory of the project;

## Code generation page
The system provides a code generation page, which is divided into "quick generation" and "individual generation", after entering the system, click "code generation" to open the code generation page.
