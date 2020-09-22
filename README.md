# eXtended Standard Exchange Format

> Specification for a modern SEF implementation

## Overview

The eXtended Standard Exchange Format ('XSEF') is an open-standard file format - files ending with the extension
.xsef.cfg - that defines the format and the format and implementation guideline for proprietary and standard EDI documents.

XSEF holds key advantages over other file formats in that it is designed for EDI

XSEF files are immediately useable by both users and computers
They're small files and are easily transmitted easily via the web
You can edit them with either a text editor or an XSEF manager
XSEF is an open standard, so you can create and distribute XSEF files 
without special permissions or royalties under the Mozilla Public License 2.0.

## Usage

The sections may appear in any order, with these exceptions: the .VER, if present, must be first. The .INI section
must be the first section in the file if there is no .VER, or the second section if there is a .VER. Nothing may appear
before these, including a comment. The .STD record, if used, must appear before .SETS. Example

```
.VER 1.6
.INI
KAVERPO,,004 010,X,X12-4010,Kaver Corp X12-4010 Purchase Order
.STD ,RE
.SETS
```

### .INI

```
[1]INVPO[2],,003[3]040,[4]X,X12-[5]3040,PO
```

```
`INVPO,,003 040,X,X12-3040,PO and INV for Slippers 'n Socks, Inc.`
```

1. The standard or implementation name (INVPO in the example above), generally the same as the filename of the SEF file.

2. Reserved

3. The Functional Group Version, Release and Industry code which will identify the standard in any Functional
   Group Envelope Header Segment. Each code is separated by a space. In the example, there is no industry code.
   With an industry code, this field might contain: 003 030 UCS

4) The responsible agency code, which identifies the standards organization in the Functional Group Header:
   GC = GENDOD
   T = for T.D.C.C. (EDIA)
   TD = TRADACOMS
   UN = for UN/EDIFACT
   X = for ASC X12 (DISA)

5) The standard on which this implementation guidelines is based.

6) The description (title) of the implementation guideline.

### .VER

The .VER section identifies the version and release of SEF, which is
currently 1.6. It should be the first record in the file. If the .VER
section is not present, SEF 1.0 is assumed.

### .PRIVATE or .PUBLIC

These sections can occur anywhere after the .INI section. The
.PRIVATE section provides a place for companies to place information
that is useful to themselves but is of no interest to others. The
.PUBLIC section marks the end of the private section.

### .STD

.STD is only included for these standards:
• Newer EDIFACT standards in which groups have position
numbers
• Newer EDIFACT and X12 standards that have repeating
elements
• Fixed-length standards like GENCOD.

### .SETS

The .SETS section defines the transaction set or message directory,
including:
• Each transaction set or message in the standard.
• For each transaction set or message, it lists each segment reference
in the order in which it appears. It also describes the requirement
and quantity for each segment when it appears in a particular
position in that set.
• Loops, groups, and tables are also set up.
In this section, all information about loops, groups, and segments is
hierarchical: for example, the quantity for a PER segment only applies
to that particular position in that particular set or message.

### .COMS

The .COMS section is the standard's composite data element
dictionary: a list of all composites in the standard. It includes:
• The composite name (C001, etc.).
• A list of each subelement reference it contains, in order.
• Each subelement's ID and requirement when used in this position
of this composite.
• Subelement relationals used within the composite.
• Subelement repeat counts.
• Masks for variations in the structure of a composite.
If the standard has no composites, this section will be omitted.

### .ELMS

The .ELMS section is the standard's data element dictionary: a list of
each element, its type, and its minimum and maximum data value
lengths.

### .CODES

The .CODES section is a list of each element that has code values,
along with its code values. It also provides information about code sets.

## License
SPDX-License-Idnetifier: MPL-2.0

