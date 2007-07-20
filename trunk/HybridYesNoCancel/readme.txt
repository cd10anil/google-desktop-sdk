Copyright (c) 2007 Google Inc.
All rights reserved

This file is part of the Google Desktop SDK and may be freely copied and used.
To download the latest version of the SDK please visit
http://desktop.google.com/



This project is a simple demonstration on how to do a call to an external DLL 
for more advanced applications than the Google Desktop scripting API supports.

This simple example is a scripting plugin which calls the DLL to display a 
message box with a Yes, No and Cancel button. The message displayed in the
message box is sent by the javascript script. Once the user clicks on a button,
a text representation of the result is sent back to the javascript script to 
display to the user. This basically shows how to send and receive data to/from
a DLL.

Note that this DLL is compiled in Visual Studio .NET 2003 using the C++
programming language.

The following are brief steps to creating a hybrid project manually:

1. Create a new ATL Project in Visual Studio .NET 2003.
2. When creating the project, uncheck Attributed in Application Settings.
3. You can safely remove the PS project added onto the solution since it won't
   be used.
4. Go to the class view, right click on your project and select Add Class.
5. Create a Simple ATL Object and name it.
6. Right click on the interface in the class view and select Add Method.
7. Name the new method.
8. Add all requested input arguments. For when you want to return a value from
   the method, create another argument and designate it as the 'retval'.
9. The template will be created for you. You can now fill in your code.
10. Modify your object's header file (YesNoCancelObj.h in this case) to set the 
    version in IDispatchImpl for major 0xFFFF and minor 0xFFFF, otherwise the 
    DLL will not load correctly when trying to instantiate from JavaScript.
11. In your project's gadget.gmanifest, add an <install> section with an
    embedded <object> tag as well. The object tag should have the clsid
    parameter set properly. You can find your clsid by looking in the
    Visual Studio project's IDL file. It is the one representing the class
    you created in step 5. If you only created on class, it will be the last
    clsid in the IDL. See this sample to see which to use if you aren't sure.
12. Depending on the object name you selected in step 11, you can create
    an instance of the DLL class using the new keyword.
