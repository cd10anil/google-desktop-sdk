// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/developer.html

#pragma once
#include "resource.h"       // main symbols

#include "YesNoCancel.h"

// CYesNoCancelObj

class ATL_NO_VTABLE CYesNoCancelObj : 
	public CComObjectRootEx<CComSingleThreadModel>,
	public CComCoClass<CYesNoCancelObj, &CLSID_YesNoCancelObj>,
	public IDispatchImpl<IYesNoCancelObj, &IID_IYesNoCancelObj, &LIBID_YesNoCancelLib, 0xFFFF, 0xFFFF> {
 public:
	CYesNoCancelObj()
	{
	}

DECLARE_REGISTRY_RESOURCEID(IDR_YESNOCANCELOBJ)

BEGIN_COM_MAP(CYesNoCancelObj)
	COM_INTERFACE_ENTRY(IYesNoCancelObj)
	COM_INTERFACE_ENTRY(IDispatch)
END_COM_MAP()

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		return S_OK;
	}
	
	void FinalRelease() 
	{
	}

 public:

  STDMETHOD(MyYesNoCancelPrompt)(BSTR* message, BSTR* result);
};

OBJECT_ENTRY_AUTO(__uuidof(YesNoCancelObj), CYesNoCancelObj)
