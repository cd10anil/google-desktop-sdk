// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/developer.html

#include "stdafx.h"
#include "resource.h"
#include "YesNoCancel.h"
#include "YesNoCancel_i.c"

class CYesNoCancelModule : public CAtlDllModuleT< CYesNoCancelModule > {
public :
	DECLARE_LIBID(LIBID_YesNoCancelLib)
	DECLARE_REGISTRY_APPID_RESOURCEID(IDR_YESNOCANCEL, "{F68D7FB1-BEDB-4372-87C7-AC90B9293F3B}")
};

CYesNoCancelModule _AtlModule;

// DLL Entry Point
extern "C" BOOL WINAPI DllMain(HINSTANCE hInstance, DWORD dwReason, LPVOID lpReserved) {
	hInstance;
    return _AtlModule.DllMain(dwReason, lpReserved); 
}

// Used to determine whether the DLL can be unloaded by OLE
STDAPI DllCanUnloadNow() {
    return _AtlModule.DllCanUnloadNow();
}

// Returns a class factory to create an object of the requested type
STDAPI DllGetClassObject(REFCLSID rclsid, REFIID riid, LPVOID* ppv) {
    return _AtlModule.DllGetClassObject(rclsid, riid, ppv);
}

// DllRegisterServer - Adds entries to the system registry
STDAPI DllRegisterServer() {
    // registers object, typelib and all interfaces in typelib
    HRESULT hr = _AtlModule.DllRegisterServer();
	return hr;
}

// DllUnregisterServer - Removes entries from the system registry
STDAPI DllUnregisterServer() {
	HRESULT hr = _AtlModule.DllUnregisterServer();
	return hr;
}
