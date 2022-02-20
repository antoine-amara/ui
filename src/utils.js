import React from "react";
import { pathOr } from "ramda";
import { EntryPropertyType } from "buttercup/web";

// http://stackoverflow.com/a/6150060/172805
export function selectElementContents(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
}

export function copyToClipboard(str) {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
}

export const generateHighlightedText = (text, regions) => {
    if (!regions) return text;

    const content = [];
    let nextUnhighlightedRegionStartingIndex = 0;

    for (let region of regions) {
        const [start, end] = region;
        content.push(
            text.substring(nextUnhighlightedRegionStartingIndex, start),
            <mark>{text.substring(start, end + 1)}</mark>
        );
        nextUnhighlightedRegionStartingIndex = end + 1;
    }
    content.push(text.substring(nextUnhighlightedRegionStartingIndex));

    return (
        <>
            {content.map((text, i) => (
                <span key={i}>{text}</span>
            ))}
        </>
    );
};

export function getFacadeField(facade, fieldName, matches) {
    const fieldIndex = facade.fields.findIndex(
        field => field.propertyType === EntryPropertyType.Property && field.property === fieldName
    );
    if (fieldIndex < 0) {
        return "";
    }

    const field = facade.fields[fieldIndex];
    let value = field.value;
    if (Array.isArray(matches)) {
        const match = matches.find(match => match.arrayIndex === fieldIndex);
        if (match) {
            return generateHighlightedText(value, match.indices);
        }
    }

    return value;
}

export function getThemeProp(props, propName) {
    const res = pathOr(null, ["theme", "vault", ...propName.split(".")], props);
    if (res === null) {
        console.warn(`No theme value found for \`${propName}\`.`);
        return "red";
    }
    return res;
}
