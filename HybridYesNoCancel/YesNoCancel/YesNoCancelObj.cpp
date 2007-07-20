// Copyright (c) 2006 Google Inc.
// All rights reserved
// 
// This file is part of the Google Desktop SDK and may be freely copied and used.
// To download the latest version of the SDK please visit 
// http://desktop.google.com/developer.html

#include "stdafx.h"
#include "YesNoCancelObj.h"
#include ".\yesnocancelobj.h"

STDMETHODIMP CYesNoCancelObj::MyYesNoCancelPrompt(BSTR* message, BSTR* result) {
  int msgbox_result = ::MessageBoxW(0, *message, L"Custom Yes, No and Cancel Box!", 
    MB_YESNOCANCEL | MB_ICONINFORMATION);

  CComBSTR return_result;
  if (msgbox_result == IDYES) {
    return_result = L"Yes!";
  } else if (msgbox_result == IDNO) {
    return_result = L"No!";
  } else {
    return_result = L"Cancel!";
  }

  *result = return_result.Detach();

  return S_OK;
}