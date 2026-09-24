© 2025 Jay Baleine - Disciplined AI Software Development · Bane's Lab documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

# Grammar — PAG — Bane's Lab

> PAG is defined by a context-free grammar written in Backus–Naur form (BNF), and its rules fall into five categories. The planning and coordination productions…

Canonical: https://banes-lab.com/pag/grammar

# Pattern Abstract Grammar

Structured instructions for LLMs

## BNF grammar

PAG is defined by a context-free grammar written in Backus–Naur form (BNF), and its rules fall into five categories. The planning and coordination productions are the grammar's own records, each grounded to a reasoning record, and the statement, expression and flowchart rules expand the terminals those records leave open. The scan described in [well-formedness](GUIDE.md#well-formedness) reads tokens rather than patterns, although the grammar itself admits a pattern literal in a condition.

### Planning rules

These rules cover [document structure](GUIDE.md#document-structure), the meta block, nodes, contracts, handoff gates, invariant records and the report.

BNF grammar

```bnf
# Instruction
<instruction> ::= <frontmatter> <optional_meta_block> <optional_document_declaration> <body>
<frontmatter> ::= "---" <yaml_content> "---"
<optional_meta_block> ::= <meta_block> | ε
<optional_document_declaration> ::= <document_declaration> | ε
<document_declaration> ::= "THIS" <document_type> <document_verb> <description>
<document_type> ::= "AGENT" | "WORKFLOW" | "PROTOCOL" | "POLICY" | "CHECKLIST" | "TEMPLATE" | "TASK" | "INSTRUCTION" | "PROMPT" | "COMMAND" | "TEST"
| "DEBUG" | "VERIFICATION" | "DISTILLATION" | "AUDIT" | "TRANSLATION" | "COMPOSITION"
<document_verb> ::= "IS" | "ENFORCES" | "EXECUTES" | "HAS" | "PERFORMS" | "PROVIDES" | "IMPLEMENTS" | "DEFINES" | "MANAGES" | "COORDINATES" | "GENERATES"
| "RESOLVES" | "FINDS" | "FIXES" | "VERIFIES" | "CLASSIFIES" | "DISTILLS" | "ABSTRACTS" | "ELIMINATES" | "AUDITS" | "MEASURES" | "SCORES" | "CORRECTS" | "RENDERS" | "COMPOSES" | "FOLDS"
<description> ::= <text>
<body> ::= <node>+ <repair_edge>* <optional_invariant_block> <optional_report_block>
<optional_invariant_block> ::= <invariant_block> | ε
<optional_report_block> ::= <report_block> | ε

# Meta block
<meta_block> ::= "%%" "META" "%%" ":" <meta_field>+
<meta_field> ::= "objective" ":" <string>
| "priority" ":" <authority_chain>
| "trust" ":" <trust_assignment> ("," <trust_assignment>)*
| "jurisdiction" ":" <scope> "|" "external" ":" <scope>
| "recursion_limit" ":" <number>
<authority_chain> ::= <identifier> (">" <identifier>)*
<trust_assignment> ::= <identifier> "=" ("TRUSTED" | "UNTRUSTED" | <identifier>)
<scope> ::= <text>

# Node
<node> ::= <node_header> <node_meta_tag>* <contract> <optional_output_contract> <handoff_gate>
<node_header> ::= "#" "NODE" <node_number> "—" <node_title> "[" <layer> "·" <axis> "·" <math_type> "·" "yields:" <shape> "]"
<node_number> ::= <digit>+
<node_title> ::= <text>
<layer> ::= "epistemic" | "conative" | "evaluative"
<axis> ::= "ontology" | "teleology" | "analysis" | "reasoning" | "formalisation" | "verification" | "representation" | "termination"
<math_type> ::= "set-theory" | "logic" | "graph" | "algebra" | "analysis" | "optimisation" | "topology" | "computation" | "probability" | "information-theory" | "dynamical-systems"
<shape> ::= "set" | "boolean" | "edge-list" | "ranking" | "procedure" | "artifact" | <text>
<node_meta_tag> ::= "@purpose" ":" <string>
| "@axis_question" ":" <string>
| "@cue" ":" <string>
| "@genesis" ":" <substrate_stage>
| "@mandatory"
<substrate_stage> ::= "existence" | "difference" | "relation" | "structure" | "transformation" | "constraint" | "emergence"

# Contract
<contract> ::= "CONTRACT" ":" "input" ":" <contract_input> "transform" ":" <directive>+ <optional_preserves> <optional_constraints> "output" ":" <text> <optional_freshness> <optional_handoff_summary>
<contract_input> ::= "NODE" <node_number> <text> | <slot> | <declared_variable> | <text>
<optional_preserves> ::= ("preserves" ":" <distinction_set>) | ε
<distinction_set> ::= <text> ("," <text>)*
<optional_constraints> ::= ("constraints" ":" <text>) | ε
<optional_freshness> ::= ("freshness" ":" <fingerprint> "+" <fingerprint>) | ε
<fingerprint> ::= <text>
<optional_handoff_summary> ::= ("handoff" ":" <text>) | ε
<optional_output_contract> ::= ("#" "OUTPUT" "CONTRACT" <declaration_statement>+) | ε
<slot> ::= "{" <identifier> ("." <identifier>)* "}"
<declared_variable> ::= <variable_name>

# Handoff gate
<handoff_gate> ::= "HANDOFF" "GATE" <optional_gate_qualifier> ":" <optional_rule_id> <check_line>+ <optional_refusal_line> <optional_standing_line> <result_line>
<optional_gate_qualifier> ::= ("(" <text> ")") | ε
<optional_rule_id> ::= ("rule_id" ":" <string> "yields" ":" <shape>) | ε
<check_line> ::= <check_marker> <check_condition> "(" "evidence" ":" <text> ")" <optional_population_clause>
<check_marker> ::= "[check]" | "ASSERT" | "REQUIRE"
<check_condition> ::= <boolean_expr>
<optional_population_clause> ::= <population_clause> | ε
<population_clause> ::= "over" ":" <set> "measured" ":" <count> "/" <count>
<set> ::= <text>
<count> ::= <number> | <text>
<optional_refusal_line> ::= ("refuse" ":" <condition> "before" <write>) | ε
<write> ::= <semantic_operation> | <text>
<optional_standing_line> ::= ("standing" ":" "moved-set" <set>) | ε
<result_line> ::= "result" ":" "pass" "->" <next_node> ("|" <failure_name> "->" "REPAIR" "(" "owner" ":" <owner_node> ")")+ "|" "unknown" "->" "BLOCKED"
<verdict> ::= "pass" | "fail" | "unknown"
<next_node> ::= "NODE" <node_number> | "TERMINATE"
<failure_name> ::= <text>
<owner_node> ::= "NODE" <node_number> | <identifier>
<repair_edge> ::= "#" "REPAIR" "EDGE" <text>

# Invariant block
<invariant_block> ::= "#" "CROSS-NODE" "INVARIANTS" <invariant_record>+
<invariant_record> ::= "INVARIANT" <name> ":" <property> "over" ":" <set> "binds" ":" <parties> "objector" ":" (<check_ref> | "none")
<name> ::= <identifier>
<property> ::= <text>
<parties> ::= <text>
<check_ref> ::= "[check]" <text>

# Report block
<report_block> ::= "REPORT" ":" <report_field>+
<report_field> ::= "subject" ":" <node_ref>
| "verdict" ":" <verdict>
| "domain" ":" "declared" <count> "measured" <count>
| "populations" ":" <partition_list>
| "inputs" ":" <fingerprint_list>
| "code" ":" <fingerprint>
| "output" ":" <fingerprint>
| "refusals" ":" <count> <reason_list>
| "unresolved" ":" <count> <reason_list>
| "completion" ":" "saturated" <boolean> "complete" <boolean> "verified" <boolean>
<node_ref> ::= "NODE" <node_number>
<partition_list> ::= <text> <count> ("," <text> <count>)*
<fingerprint_list> ::= <text> <fingerprint> ("," <text> <fingerprint>)*
<reason_list> ::= "[" <text> ("," <text>)* "]"

# Macro
<macro> ::= "USE" "TEMPLATE" <template_name>
<template_name> ::= <identifier>

# Rule
<rule_declaration> ::= "RULE" <rule_name> ":" <rule_body>
<rule_name> ::= <identifier>
<rule_body> ::= <when_clause>* <directive>+
<when_clause> ::= "WHEN" <condition> ":" <directive>+
```

### Statement rules

These rules cover directives, actions, control flow and declarations.

BNF grammar

```bnf
# Directive
<directive> ::= <optional_task_marker> <optional_meta_tag> <optional_context_cue> <directive_body>
<directive_body> ::= <action_expr>
| <control_flow>
| <declaration_statement>
| <transform_statement>
| <discovery_statement>
| <iteration_statement>
| <function_declaration>
| <announcement_statement>
| <state_machine_declaration>
| <dag_declaration>
| <priority_queue_declaration>
| <priority_queue_operation>
| <surface_declaration>
| <wait_statement>
| <flowchart_declaration>
| <mermaid_declaration>
| <ascii_flowchart_block>
| <macro>
<optional_task_marker> ::= <task_marker> | ε
<task_marker> ::= "[" <task_state> "]"
<task_state> ::= " " | "x" | ">"
<optional_meta_tag> ::= <node_meta_tag> | ε
<optional_context_cue> ::= ("@cue" ":" <string>) | ε

# Action expression
<action_expr> ::= <action_verb> <modifier>* <action_target> <optional_action_args>
<action_verb> ::= <semantic_operation>
| "EXECUTE" | "READ" | "WRITE" | "DELETE" | "REMOVE" | "ANALYZE"
| "CREATE" | "FIND" | "REPORT" | "VALIDATE" | "VERIFY"
| "COLLECT" | "EXTRACT" | "LINK" | "DETERMINE" | "CLASSIFY"
| "INVESTIGATE" | "FILTER" | "COMPARE" | "CONVERT" | "MERGE" | "SPLIT" | "MARK"
| "SORT" | "RANK" | "ORDER" | "INSERT" | "APPEND"
| "ADD" | "MOVE" | "COPY" | "BACKUP" | "RESTORE" | "LOAD"
| "ITERATE" | "ATTEMPT" | "ENFORCE" | "RENAME"
| "FAIL" | "EXIT" | "RETURN" | "WAIT" | "SEND"
| "REDUCE" | "PROPAGATE" | "FINALIZE" | "EVIDENCE"
| "PREDICT" | "EXPLAIN" | "REFLECT" | "ABSTRACT" | "GENERALISE" | "DESCRIBE" | "FORMALISE"
<semantic_operation> ::= "DISCOVER_RESOURCES" | "READ_RESOURCE" | "SEARCH_CONTENT" | "ANALYZE_CONTENT" | "EXTRACT_FACTS" | "CALCULATE_METRIC"
| "COMPOSE_ARTIFACT" | "VALIDATE_ARTIFACT" | "PERSIST_ARTIFACT" | "EXECUTE_TOOL" | "REQUEST_DECISION" | "REPORT_RESULT"
<modifier> ::= "MUST" | "NEVER" | "ALWAYS" | "REQUIRED" | "MANDATORY"
<action_target> ::= <tool_name> | <path> | <variable_name>
<tool_name> ::= "SYSTEM" | "USER" | "SERVICE"
<optional_action_args> ::= <parenthesized_args> | <bare_args> | ε
<parenthesized_args> ::= "(" <arg_list> ")"
<bare_args> ::= <arg_list>
<arg_list> ::= <arg> ("," <arg>)*
<arg> ::= <identifier> | <literal> | <expression>

# Control flow
<control_flow> ::= <if_statement>
| <for_loop>
| <while_loop>
| <try_catch>
| <goto_statement>
| <label_declaration>
| <flow_marker>
<if_statement> ::= "IF" <condition> ":" <directive>+
("ELSE" "IF" <condition> ":" <directive>+)*
<optional_else_clause>
<optional_else_clause> ::= ("ELSE" ":" <directive>+) | ε
<for_loop> ::= "FOR" "EACH" <iterator> "IN" <collection> ":" <directive>+
<while_loop> ::= "WHILE" <condition> ":" <directive>+
<try_catch> ::= "TRY" ":" <directive>+
"CATCH" <optional_exception_var> ":" <directive>+
<optional_exception_var> ::= <exception_var> | ε
<exception_var> ::= <identifier>
<goto_statement> ::= "GOTO" <label_identifier>
<label_declaration> ::= <label_identifier> ":"
<label_identifier> ::= <identifier>
<flow_marker> ::= "START" <optional_label>
| "LOOP" <optional_backto>
| "END"
| "STOP"
<optional_label> ::= <identifier> | ε
<optional_backto> ::= ("BACKTO" <identifier>) | ε

# Declaration statement
<declaration_statement> ::= "SET" <variable_name> "=" <expression>
| "DECLARE" <variable_name> ":" <type_annotation>
<type_annotation> ::= "string" | "number" | "boolean" | "array" | "object" | "file" | "context"

# Transform statement
<transform_statement> ::= <backup_directive> <edit_directive> <optional_analyze_directive>
<backup_directive> ::= "BACKUP" <path> "TO" <backup_location>
| "COPY" <path> "TO" <backup_location>
<edit_directive> ::= "PERSIST_ARTIFACT" <artifact> "TO" <destination>
| "WRITE" <path> <write_spec>
| "EXECUTE_TOOL" <edit_command> "WITH" "timeout" ":" <number>
<edit_command> ::= <identifier>
<artifact> ::= <variable_name>
<analyze_directive> ::= "VALIDATE_ARTIFACT" <artifact> "AGAINST" <verification_condition>
<optional_analyze_directive> ::= <analyze_directive> | ε
<backup_location> ::= <path>
<write_spec> ::= "CONTENT" <string>
| "FROM" <source_file>
| "INTO" <destination>
| <string>
<source_file> ::= <path>
<destination> ::= <path>
<verification_condition> ::= <condition>

# Discovery statement
<discovery_statement> ::= <discovery_action> <optional_verification_check>
<discovery_action> ::= "DISCOVER_RESOURCES" <pattern> <optional_scope> "INTO" <collection_var>
| "SEARCH_CONTENT" <search_scope> "FOR" <search_term> "INTO" <collection_var>
| "FIND" <search_term> "IN" <search_location>
<verification_check> ::= "IF" "exists" ":" <directive>+
| "ANALYZE" <expression> <comparison_op> <expression>
<optional_verification_check> ::= <verification_check> | ε
<optional_scope> ::= "IN" <search_scope> | ε
<search_scope> ::= <path>
<search_location> ::= <path>
<search_term> ::= <string>
<collection_var> ::= <variable_name>
```

### Expression rules

These rules cover expressions, operators, literals and lexical elements.

BNF grammar

```bnf
# Expressions
<expression> ::= <pipeline_expr>
<pipeline_expr> ::= <logical_or_expr> ("|>" <logical_or_expr>)*
<logical_or_expr> ::= <logical_and_expr> ("OR" <logical_and_expr>)*
<logical_and_expr> ::= <equality_expr> ("AND" <equality_expr>)*
<equality_expr> ::= <relational_expr> (("===" | "!==") <relational_expr>)*
<relational_expr> ::= <additive_expr> (("<" | ">" | "<=" | ">=") <additive_expr>)*
| <additive_expr> "MATCHES" <pattern>
| <additive_expr> "FOR" <expression>
| <additive_expr> "BETWEEN" <expression>
<additive_expr> ::= <multiplicative_expr> (("+" | "-") <multiplicative_expr>)*
<multiplicative_expr> ::= <unary_expr> (("*" | "/" | "%") <unary_expr>)*
<unary_expr> ::= ("!" | "NOT" | "-" | "+") <postfix_expr>
| <postfix_expr>
<postfix_expr> ::= <primary_expr> <postfix_op>*
<postfix_op> ::= "[" <expression> "]"
| "." <identifier>
| "(" <optional_arg_list> ")"
<primary_expr> ::= <array_literal>
| <object_literal>
| <literal>
| <identifier>
| "(" <expression> ")"
<array_literal> ::= "[" <optional_expression_list> "]"
<object_literal> ::= "{" <optional_key_value_pairs> "}"
<expression_list> ::= <expression> ("," <expression>)*
<optional_expression_list> ::= <expression_list> | ε
<key_value_pair> ::= <object_key> ":" <expression>
<object_key> ::= <identifier> | <string> | <number>
<key_value_pairs> ::= <key_value_pair> ("," <key_value_pair>)*
<optional_key_value_pairs> ::= <key_value_pairs> | ε
<function_call> ::= <function_name> "(" <optional_arg_list> ")"
<optional_arg_list> ::= <arg_list> | ε
<condition> ::= <expression>
<boolean_expr> ::= <logical_or_expr>
<verification_expr> ::= <expression>
<term> ::= <multiplicative_expr>
<factor> ::= <primary_expr>
<pattern> ::= <string> | <regex_literal>
<regex_literal> ::= "/" <regex_pattern> "/" <optional_regex_flags>
<optional_regex_flags> ::= <regex_flags> | ε
<regex_pattern> ::= <any_regex_character>+
<regex_flags> ::= <letter>+
<comparison_op> ::= "===" | "!==" | "<" | ">" | "<=" | ">="

# Lexical
<identifier> ::= <letter> (<letter> | <digit> | "_" | "-")*
<variable_name> ::= <identifier>
<function_name> ::= <identifier>
<node_name> ::= <identifier>
<path> ::= <directory_path> | <file_path>
<directory_path> ::= <path_segment> ("/" <path_segment>)* "/"
<file_path> ::= <path_segment> ("/" <path_segment>)* <optional_file_extension>
<path_segment> ::= <identifier>
<optional_file_extension> ::= ("." <identifier>) | ε
<literal> ::= <number> | <string> | <boolean>
<number> ::= <digit>+ <optional_decimal>
<optional_decimal> ::= ("." <digit>+) | ε
<string> ::= '"' <char>* '"' | "'" <char>* "'"
<boolean> ::= "true" | "false"
<digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<letter> ::= "a".."z" | "A".."Z"
<char> ::= <any_character>
<text> ::= <char>+
<yaml_content> ::= <text>
<any_character> ::= <letter> | <digit> | <whitespace> | <symbol>
<symbol> ::= "_" | "-" | "." | "," | ":" | ";" | "!" | "?" | "@" | "#" | "$" | "%" | "^" | "&" | "*" | "(" | ")" | "[" | "]" | "{" | "}" | "<" | ">" | "/" | "\" | "|" | "=" | "+" | "`" | "~"
<any_regex_character> ::= <letter> | <digit> | <symbol>
<whitespace> ::= " " | "	" | "
" | "
"

# Iteration statement
<iteration_statement> ::= <loop_header> <loop_body>
<loop_header> ::= "FOR" "EACH" <iterator> "IN" <collection>
<loop_body> ::= ":" <directive>+ <optional_accumulation> <optional_recursion_limit>
<accumulation_statement> ::= "APPEND" <value> "TO" <accumulator>
| "CREATE" <structure> "FROM" <iterator>
| "EXTRACT" <components> "INTO" <structure>
| "WRITE" <data> "INTO" <storage>
| "COLLECT" <items> "INTO" <collection>
| "SET" <state_var> "=" <state_expr>
<recursion_limit> ::= "recursion_limit" ":" <number>
<optional_accumulation> ::= <accumulation_statement> | ε
<optional_recursion_limit> ::= <recursion_limit> | ε
<iterator> ::= <variable_name>
<collection> ::= <variable_name> | <expression>
<value> ::= <expression>
<accumulator> ::= <variable_name>
<structure> ::= <variable_name>
<components> ::= <expression>
<data> ::= <expression>
<items> ::= <expression>
<storage> ::= <variable_name>
<state_var> ::= <variable_name>
<state_expr> ::= <expression>

# Function declaration
<function_declaration> ::= "FUNCTION" <function_name> "(" <optional_param_list> ")" ":" <directive>+
<optional_param_list> ::= <param_list> | ε
<param_list> ::= <parameter> ("," <parameter>)*
<parameter> ::= <variable_name>

# Announcement statement
<announcement_statement> ::= "REPORT" <message>
<message> ::= <string> | <expression>
```

### Coordination rules

These rules cover the structure declarations, the [shared surface](ORCHESTRATION.md#shared-surfaces) and the [semantic operations](GUIDE.md#tool-invocation).

BNF grammar

```bnf
# Await
<await_statement> ::= "AWAIT" <awaitable_expression> <optional_result_binding>
<awaitable_expression> ::= <identifier> | <string> | <tool_invocation>
<optional_result_binding> ::= "INTO" <identifier> | ε

# Parallel
<parallel_block> ::= "PARALLEL" ":" <directive>+ "END"

# Surface
<surface_declaration> ::= "SURFACE" <surface_key> ":" <record_declaration>+
<record_declaration> ::= "RECORD" <record_id> "subject" ":" <subject_key> <edge_clause>* <item>*
<item> ::= "ITEM" <item_id> "TO" <reader> ":" <text>
<edge_clause> ::= <edge_kind> <target_id>
<edge_kind> ::= "PARENT" | "SATISFIED_BY" | "BLOCKS" | "ANSWERS" | "REFUTES" | "SUPERSEDES"
<derived_state> ::= "OPEN" | "BLOCKED" | "ABSORBED"
<wait_statement> ::= "WAIT" "ON" <surface_key> "AS" <reader> "INTO" <diff_binding>
<barrier_statement> ::= "BARRIER" "ON" <surface_key>
<swap_statement> ::= "SWAP" <span> "AGAINST" <read>
<reader> ::= "participant" | "bounded" | <identifier>
<surface_key> ::= <identifier>
<record_id> ::= <surface_key> "-" <number>
<item_id> ::= <record_id> "-" <number>
<subject_key> ::= <identifier>
<target_id> ::= <record_id> | <path>
<diff_binding> ::= <variable_name>
<span> ::= <text>
<read> ::= <variable_name>

# State machine
<state_machine_declaration> ::= "STATE_MACHINE" <machine_name> ":" <state_definition>+ <transition_definition>+
<state_definition> ::= "STATE" <state_name> <optional_state_type>
<optional_entry_actions>
<optional_exit_actions>
<transition_definition> ::= "TRANSITION" "FROM" <state_name> "TO" <state_name>
"ON" <event_name>
<optional_guard>
<optional_transition_actions>
<optional_state_type> ::= ":" <state_type> | ε
<optional_entry_actions> ::= "ENTRY" ":" <directive>+ | ε
<optional_exit_actions> ::= "EXIT" ":" <directive>+ | ε
<optional_guard> ::= "GUARD" ":" <condition> | ε
<optional_transition_actions> ::= ":" <directive>+ | ε
<machine_name> ::= <variable_name>
<state_name> ::= <variable_name>
<state_type> ::= <identifier>
<event_name> ::= <variable_name>

# DAG
<dag_declaration> ::= "DAG" <dag_name> ":" <dag_item>+
<dag_item> ::= <node_definition> | <parallel_group>
<node_definition> ::= "NODE" <node_name> <optional_node_type>
<optional_depends_on>
<optional_after>
<optional_before>
":" <directive>+
<parallel_group> ::= "PARALLEL_GROUP" ":" <node_name_list>
<dependency_list> ::= <node_name> ("," <node_name>)*
<dependent_list> ::= <node_name> ("," <node_name>)*
<node_name_list> ::= <node_name> ("," <node_name>)*
<optional_node_type> ::= ":" <node_type> | ε
<optional_depends_on> ::= "DEPENDS_ON" "[" <dependency_list> "]" | ε
<optional_after> ::= "AFTER" <dependency_list> | ε
<optional_before> ::= "BEFORE" <dependent_list> | ε
<dag_name> ::= <variable_name>
<node_type> ::= <identifier>

# Priority queue
<priority_queue_declaration> ::= "PRIORITY_QUEUE" <queue_name>
<optional_comparison>
":"
<priority_queue_operation> ::= <enqueue_statement>
| <dequeue_statement>
| <peek_statement>
| <heapify_statement>
<enqueue_statement> ::= "ENQUEUE" <value> "TO" <queue_name>
<optional_priority>
<dequeue_statement> ::= "DEQUEUE" "FROM" <queue_name>
<optional_target>
<peek_statement> ::= "PEEK" <queue_name>
<optional_target>
<heapify_statement> ::= "HEAPIFY" <queue_name>
<comparison_function> ::= <function_name>
| "(" <optional_param_list> ")" "→" <expression>
<optional_comparison> ::= "COMPARE_BY" <comparison_function> | ε
<optional_priority> ::= "PRIORITY" "=" <priority_value> | ε
<optional_target> ::= "TO" <target_variable> | ε
<queue_name> ::= <variable_name>
<priority_value> ::= <number> | <expression>
<target_variable> ::= <variable_name>

# Cross reference
<cross_reference_statement> ::= <collect_from_statement>
| <find_in_statement>
| <reference_statement>
| <link_statement>
<collect_from_statement> ::= "FROM" <file_path_pattern> "COLLECT" <selector> "TO" <target_variable>
<find_in_statement> ::= "FROM" <file_path_pattern> "FIND" <search_term> "TO" <target_variable>
<reference_statement> ::= "REFERENCE" <file_path_pattern> <optional_alias>
<link_statement> ::= "LINK" <source_expression> "TO" <file_reference>
<file_path_pattern> ::= <string> | <glob_pattern>
<glob_pattern> ::= <string>
<file_reference> ::= <string> <optional_anchor>
<optional_anchor> ::= "#" <identifier> | ε
<selector> ::= <expression> | "*"
<search_term> ::= <string> | <regex_literal>
<target_variable> ::= <variable_name>
<source_expression> ::= <expression>
<alias> ::= <identifier>
<optional_alias> ::= "AS" <alias> | ε

# Semantic operation
<tool_invocation> ::= <semantic_operation> <tool_target> <optional_tool_param_clause> <optional_tool_result_clause>
<tool_target> ::= <string> | <identifier> | <file_path> | <expression>
<optional_tool_param_clause> ::= <tool_param_clause> | ε
<tool_param_clause> ::= "WITH" <tool_param_list>
| "USING" <tool_param_list>
<tool_param_list> ::= <tool_param_pair> ("," <tool_param_pair>)*
<tool_param_pair> ::= <tool_param_name> ":" <tool_param_value>
| <tool_param_name> "=" <tool_param_value>
| <tool_param_name>
<tool_param_name> ::= <identifier>
<tool_param_value> ::= <string>
| <number>
| <boolean>
| <identifier>
| <array_literal>
| <object_literal>
<optional_tool_result_clause> ::= <tool_result_clause> | ε
<tool_result_clause> ::= "->" <tool_result_binding>
| "INTO" <tool_result_binding>
| "AS" <tool_result_binding>
<tool_result_binding> ::= <identifier>
```

### Flowchart rules

These rules cover flowcharts written in PAG's own form, in ASCII and in Mermaid.

BNF grammar

```bnf
# Flowchart
<flowchart_declaration> ::= "FLOWCHART" <flowchart_name> <optional_flowchart_state> <optional_flowchart_layout> ":" <flowchart_body>
<optional_flowchart_layout> ::= "LAYOUT" <flowchart_layout> | ε
<flowchart_body> ::= <flowchart_line>+ <optional_error_handler>
<optional_error_handler> ::= <error_handler> | ε
<error_handler> ::= "ON" "ERROR" ":" <directive>+
<flowchart_line> ::= <flowchart_node>
| <flowchart_edge>
| <flowchart_branch>
| <flowchart_merge>
| <flowchart_loop>
<flowchart_node> ::= <node_label> <node_shape> <optional_shape_type> <optional_node_content>
<node_label> ::= <identifier> | <string>
<node_shape> ::= "[" <text> "]"
| "(" <text> ")"
| "{" <text> "}"
| "<" <text> ">"
| "((" <text> "))"
| "[[" <text> "]]"
<optional_shape_type> ::= ":" <flowchart_shape_types> | ε
<optional_node_content> ::= <node_content> | ε
<node_content> ::= ":" <node_block>
<node_block> ::= <directive>+
| "EVALUATE" <condition>
| "EXECUTE" <function_call>
| "TRY" ":" <directive>+ "CATCH" ":" <directive>+
<optional_flowchart_state> ::= "WITH" "STATE" <state_declaration>+ | ε
<state_declaration> ::= <variable_name> ":" <type_annotation> "=" <expression>
<flowchart_edge> ::= <edge_source> <edge_arrow> <edge_target> <optional_edge_label>
<edge_source> ::= <identifier>
<edge_target> ::= <identifier>
<edge_arrow> ::= "→" | "↓" | "↑" | "←" | "↔"
| "-->" | "--->" | "==>" | "-.->>"
| "|"
<optional_edge_label> ::= ":" <string> | ε
<flowchart_branch> ::= <branch_source> "/" <branch_option>+
<branch_source> ::= <identifier>
<branch_option> ::= <branch_condition> "→" <branch_target>
<branch_condition> ::= <condition> | <string>
<branch_target> ::= <identifier>
<flowchart_merge> ::= <merge_source>+ "◄" <merge_target>
<merge_source> ::= <identifier>
<merge_target> ::= <identifier>
<flowchart_loop> ::= "LOOP" <loop_source> "→" <loop_target> <optional_loop_limit>
<loop_source> ::= <identifier>
<loop_target> ::= <identifier>
<optional_loop_limit> ::= "MAX" <number> | ε
<flowchart_shape_types> ::= "process"
| "decision"
| "start_end"
| "input_output"
| "subprocess"
| "database"
<flowchart_layout> ::= "vertical" | "horizontal" | "lr" | "rl" | "tb" | "bt"
<flowchart_name> ::= <variable_name>

# ASCII flowchart
<ascii_flowchart_block> ::= <ascii_flowchart_line>+
<ascii_flowchart_line> ::= <ascii_node_line>
| <ascii_connector_line>
| <ascii_branch_line>
| <ascii_merge_line>
<ascii_node_line> ::= <indent> <ascii_node>
<ascii_node> ::= "[" <text> "]"
| "(" <text> ")"
| "{" <text> "}"
| "<" <text> ">"
<ascii_connector_line> ::= <indent> "|"
| <indent> "│"
| <indent> "▼"
| <indent> "▲"
| <indent> "►"
| <indent> "◄"
<ascii_branch_line> ::= <indent> "/" <indent> "\"
| <indent> "▼" <indent> "▼"
<ascii_merge_line> ::= <indent> "\" <indent> "/"
| <indent> "◄" "─" "┘"
<indent> ::= <whitespace>*

# Mermaid flowchart
<mermaid_declaration> ::= "MERMAID" <mermaid_type> ":" <mermaid_body>
<mermaid_type> ::= "flowchart" | "graph" | "sequence" | "class" | "state" | "er"
<mermaid_body> ::= <mermaid_line>+
<mermaid_line> ::= <mermaid_node_def>
| <mermaid_connection>
| <mermaid_subgraph>
| <mermaid_style>
<mermaid_node_def> ::= <node_id> <mermaid_node_shape> <optional_node_text>
<node_id> ::= <identifier>
<mermaid_node_shape> ::= "[" <text> "]"
| "(" <text> ")"
| "{" <text> "}"
| "((" <text> "))"
| "[[" <text> "]]"
| "[/" <text> "/]"
| "[\" <text> "\]"
<optional_node_text> ::= <text> | ε
<mermaid_connection> ::= <node_id> <mermaid_arrow> <node_id> <optional_connection_text>
<mermaid_arrow> ::= "-->" | "--->" | "==>" | "-.->" | "--"
<optional_connection_text> ::= "|" <text> "|" | ε
<mermaid_subgraph> ::= "subgraph" <subgraph_title> <mermaid_line>+ "end"
<subgraph_title> ::= <string>
<mermaid_style> ::= "style" <node_id> <style_properties>
<style_properties> ::= <style_property> ("," <style_property>)*
<style_property> ::= <identifier> ":" <string>
```

---

Chapters: [Introduction](INTRODUCTION.md) · [Guide](GUIDE.md) · [Orchestration](ORCHESTRATION.md) · [Patterns](PATTERNS.md) · [Keywords](KEYWORDS.md) · [Grammar](GRAMMAR.md) · [Validation](VALIDATION.md) · [Templates](TEMPLATES.md)
