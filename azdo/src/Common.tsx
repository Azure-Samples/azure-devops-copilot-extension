// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import "azure-devops-ui/Core/override.css";
import "azure-devops-ui/Core/_platformCommon.scss";
import "es6-promise/auto";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./Common.scss";

export function showRootComponent(component: React.ReactElement<any>) {
    ReactDOM.render(component, document.getElementById("root"));
}