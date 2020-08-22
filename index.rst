..  Copyright (c) 2020, FreightTrust and Clearing Corporation
    All rights reserved.
    
[MOZILLA PUBLIC LICENSE 2.0]

[PROJECT_SPECIFICATION]
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents

Introduction (informative)
==========================

*All content in this document is normative unless marked "(informative)".*

{INTRODUCTION_CONTENT}


Terminology
===========

In [PROJECT_NAME]:

- "$FOO" (usually named ``.foo``) store settings,
  and must conform to this specification.
- "$BAR" parse files conforming to this specification.

A conforming core or Transaction Set must pass the tests in the
`core-tests repository`_ or `Transaction Set-tests repository`_, respectively.

*(informative)* [INFORMATIVE]

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

XSEF files should be UTF-8 encoded, with LF or CRLF line separators.

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

TODO.

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
