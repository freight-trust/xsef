..  Copyright (c) 2020, FreightTrust and Clearing Corporation
    All rights reserved.
   
.. SPDX-License-Identifier: MPL-2.0

XSEF SPECIFICATION 1.0.1+ALPHA
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents

Introduction (informative)
==========================

*All content in this document is normative unless marked "(informative)".*

Version/Release/Industry Identifier (VRI) Code
The Version, Release, and Industry Identifier Code are prefilled with values from the
base standard. If this information is not available the fields are blank.

For X12
Leave the Version, Release, and Industry Identifier Code
values as they are unless you are on a standards board or are
developing a new guideline or MIG for a particular industry.
Version and Release are usually 3 digits. If present, Industry
Identifier Code is up to 6 alphanumeric characters. Together,
these three fields are placed in Element 480 in the GS (group
header) segment.

For EDIFACT
Version and release are both usually 1-3 alphanumeric
characters. Example: D93A has version D and release 93A.
UN-921 has version 92 and release 1. These fields are in the
UNH and UNG segments.

For TRADACOMS
By default, version is 1 and Industry Code is ANA (Article
Numbering Assn.). Since there is no release, this field is set to
0 (zero).


Terminology
===========

In XSEF:

- "xsef" (usually named ``.xsef.cfg``) store settings,
  and must conform to this specification.
- "Core" parse files conforming to this specification.
- "Plugins" apply settings to files being edited, and use cores to
  determine the settings.

A conforming core or Transaction Set must pass the tests in the
`core-tests repository`_ or `Transaction Set-tests repository`_, respectively.

*(informative)* Plugins can be delineated into 'meta' plugins, e.g. 'X12' or 'EDIFACT'
 with versions of those meta plugins being actually the ones used.

// TODO

File Format
===========

XSEF are files in an INI-like file format. XSEF is an implementation of the existing
SEF format, or STANDARD EXCHANGE FORMAT (.SEF).

XSEF/SEF are Rules for DEFINING EDI transactions

In an XSEF file, all beginning
whitespace on each line is considered irrelevant. Each line must be one of the
following:

- Blank: contains only whitespace characters.
- Comment: starts with a ``;`` or a ``#``.
   - Inserting a ``#`` or ``;`` after non-whitespace characters in a line
     (i.e., inline) shall neither be parsed as a comment nor as part of the
     section name, pair (defined below) key or value in which it was inserted. This may change
     in the future; thus, is not recommended.
- Section Header: starts with a ``[`` and ends with a ``]``.
   - May not use any non-whitespace characters outside of the surrounding
     brackets.
   - May contain any characters between the square brackets (e.g.,
     ``[`` and ``]`` and even spaces and tabs are allowed).
   - Forward slashes (``/``) are used as path separators.
   - Backslashes (``\\``) are not allowed as path separators (even on Windows).
- Key-Value Pair (or Pair): contains a key and a value, separated by an `=`.
   - Key: the part before the first `=` (trimmed of whitespace).
   - Value: The part after the first `=` (trimmed of whitespace).

Any line that is not one of the above is invalid.

XSEF files should be UTF-8 encoded, with LF  line separators.

`CRLF can be used but is not favoured`

 XSEF defines the following terms:

- Trailer: 
- Segment Name: the string between the beginning ``[`` and the ending ``]``.
- Group: the lines starting from a Section Header until the beginning of
  the next Section Header or the end of the file.

Glob Expressions
================

Section names in XSEF files are filepath globs, similar to the format
accepted by ``.gitignore``. They support pattern matching through Unix
shell-style wildcards. These filepath globs recognize the following as
special characters for wildcard matching:

.. list-table::
   :header-rows: 1

   * - Special Characters
     - Matching
   * - ``*``
     - any string of characters, except path separators (``/``)
   * - ``**``
     - any string of characters
   * - ``?``
     - any single character, except path separators (``/``)
   * - ``[seq]``
     - any single character in seq
   * - ``[!seq]``
     - any single character not in seq
   * - ``{s1,s2,s3}``
     - any of the strings given (separated by commas, can be nested)
   * - ``{num1..num2}``
     - any integer numbers between ``num1`` and ``num2``, where ``num1`` and ``num2``
       can be either positive or negative

The backslash character (``\\``) can be used to escape a character so it is
not interpreted as a special character.

The maximum length of a section name is 4096 characters. All sections
exceeding this limit are ignored.

File Processing
===============

When a filename is given to XSEF a search is performed in the
directory of the given file and all parent directories for an XSEF
file (named ".XSEF" by default). Non-existing directories are treated
as if they exist and are empty. All found XSEF files are
searched for sections with section names matching the given filename. The
search shall stop if an XSEF file is found with the ``root``
key set to ``true`` in the preamble or when reaching the root
filesystem directory.

Files are read top to bottom and the most recent rules found take
precedence. If multiple XSEF files have matching sections, the rules
from the closer XSEF file are read last, so pairs in closer
files take precedence.

Supported Pairs
===============

XSEF file sections contain key-value pairs separated by an
equal sign (``=``). With the exception of the ``root`` key, all pairs MUST be
located under a section to take effect. XSEF Transaction Sets shall ignore
unrecognized keys and invalid/unsupported values for those keys.

Here is the list of all keys defined by this version of this specification,
and the supported values associated with them:

.. list-table::
   :header-rows: 1

   * - Key
     - Supported values
   * - ``indent_style``
     - Set to ``tab`` or ``space`` to use hard tabs or soft tabs respectively. The
       values are case insensitive.
   * - ``indent_size``
     - Set to a whole number defining the number of columns used for each
       indentation level and the width of soft tabs (when supported). If this
       equals ``tab``, the ``indent_size`` shall be set to the tab size, which
       should be ``tab_width`` (if specified); else, the tab size set by the
       editor. The values are case insensitive.
   * - ``tab_width``
     - Set to a whole number defining the number of columns used to represent
       a tab character. This defaults to the value of ``indent_size`` and should
       not usually need to be specified.
   * - ``end_of_line``
     - Set to ``lf``, ``cr``, or ``crlf`` to control how line breaks are
       represented. The values are case insensitive.
   * - ``charset``
     - Set to ``latin1``, ``utf-8``, ``utf-8-bom``, ``utf-16be`` or ``utf-16le`` to
       control the character set. Use of ``utf-8-bom`` is discouraged.
   * - ``trim_trailing_whitespace``
     - Set to ``true`` to remove all whitespace characters preceding newline
       characters in the file and ``false`` to ensure it doesn't.
   * - ``insert_final_newline``
     - Set to ``true`` ensure file ends with a newline when saving and ``false``
       to ensure it doesn't.
   * - ``root``
     - Must be specified in the preamble. Set to ``true`` to stop the
       ``.XSEF`` file search on the current file. The value is case
       insensitive.

For any pair, a value of ``unset`` removes the effect of that
pair, even if it has been set before. For example, add ``indent_size =
unset`` to undefine the ``indent_size`` pair (and use editor defaults).

Pair keys are case insensitive. All keys are lowercased after parsing.
The maximum length of a pair key is 50 characters and the maximum length
of a pair value is 255 characters. Any key or value beyond these limits
shall be ignored.

Suggestions for Transaction Set Developers
=================================

|SEG     "^UNB"     InterchangeHeader       M 1 1 ACC 1     T F "UNB Interchange Header" CUT-ON-(+)
||SEG    ""          Sender                 M 1 1 ACC 1     R W "UNB-S002 composite data" CUT-ON-(:) 
|||GRP   ""           Identifier            M 1 1 ACC 1     R W "UNB-0004 - Sender identifier & Qualifier"
||D      "(.*)"      ApplicationReference   O 0 1 ACC 1     R W "UNB-0026 - APPLICATION REFERENCE" ASMATCHED [1..14]
||D      "(.*)"      PriorityCode           O 0 1 ACC 1     R W "UNB-0029 - PROCESSING PRIORITY CODE" ALPHA [1..1]
||D      "(.*)"      AckRequest             O 0 1 ACC 1     R W "UNB-0031 - ACKNOWLEDGEMENT REQUEST" NUMERIC [1..1]
||D      "(.*)"      AgreementId            O 0 1 ACC 1     R W "UNB-0032 - COMMUNICATIONS AGREEMENT ID" ASMATCHED [1..35]


Interchange Segment Specifications
------------------------------------

Interchange
Segment Specifications


Basic Interchange Segments
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Interchange Segment
-------------------
Specifications


Segment Specifications
```````````````````````````

 
Interchange Segment
-------------------
Specifications
Segment Specifications 

Specifications for the interchange segments are provided in the
segment directory.


-------------------
Specifications
Segment Specifications:


Interchange Control Header Segment (ISA)
`````````````````````````````````````````````


Interchange Segment
-------------------
Specifications  Interchange Control Header Segment (ISA)


Purpose
--------
To start and identify an interchange of zero or more functional groups
and interchange-related control segments.

Interchange Segment Specifications

Interchange Control Header Segment (ISA)
============================================

The actual values of the data element separator, component element
separator, repetition separator, and segment terminator for this
interchange are set by the interchange control header. For a
particular interchange, the value at the fourth character position of
the interchange control header is the data element separator, and the
value of the last character position is the segment terminator. The
extent of this particular usage of the data element separator,
component element separator, and the segment terminator is from this
header to, and including, the next interchange trailer. The
interchange control number value in this header must match the value
in the same data element in the IEA segment.


Interchange Segment
-------------------

Interchange Control Header Segment (ISA)
============================================


In order to provide sufficient discrimination for the acknowledgment
process to operate reliably and to ensure that audit trails are
unambiguous, the combination of interchange sender's qualifier and ID
(ISA05, ISA06), interchange receiver's qualifier and ID (ISA07, ISA08)
and the interchange control number value (ISA13) shall by themselves
be unique within a reasonably extended time frame whose boundaries
shall be defined by trading partner agreement. Because at some point
it may be necessary to reuse a sequence of control numbers, the
Interchange Date and Time may serve as an additional discriminant only
to differentiate interchange identity over the longest possible time
frame.


Interchange Segment
-------------------
Interchange Control Header Segment (ISA)


Interchange Control Trailer Segment (IEA)
============================================

 
Interchange Segment
-------------------
Specifications
Interchange Control Trailer Segment (IEA)


Purpose:
To define the end of an interchange of zero or more functional groups
and interchange-related control segments.


Interchange Segment
-------------------
Specifications 
Interchange Control Trailer Segment (IEA)

The interchange control number in this trailer must match the value in
the same data element in the corresponding ISA segment.


Interchange Segment
-------------------
Specifications 

Interchange Control Trailer Segment (IEA)


Interchange Acknowledgment Segment (TA1)
============================================

 
Interchange Segment
-------------------
Specifications ta1ta1_1n 
Interchange Acknowledgment Segment (TA1)


Purpose:
To report the status of the processing of an interchange header and
trailer by the addressed receiver or the non-delivery by a network
provider.


Interchange Segment
-------------------
Specifications
Interchange Acknowledgment Segment (TA1):




Versioning
==========

*XSEF UTILIZES SEMVER*

This specification has a version, tagged in the `specification repository`_.
Each specification version corresponds to the same version in the
`core-tests repository`_.



.. _core-tests repository: TODO
.. _Python configparser Library: TODO
.. _Transaction Set Guidelines: TODO
.. _Transaction Set-tests repository: TODO
.. _specification repository: TODO
x
