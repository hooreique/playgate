# The name of this theme, _hoobira_, means the _hoo_ mod of _bira_.
# This theme was inspired by _bira_, a built-in theme of _oh-my-zsh_.

local return_code_symbol="%(?.○.●)"
local user_host="%(!.%{$fg[red]%}.%{$fg[green]%})%n@%m%{$reset_color%}"
local current_dir="%{$fg[blue]%}%~%{$reset_color%}"
local user_symbol='%(!.#.$)'

local git_status='$(git_prompt_info)$(git_prompt_status)$(git_prompt_remote)'

PROMPT="╭${return_code_symbol} ${user_host} ${current_dir}${git_status}
╰${user_symbol} "

ZSH_THEME_GIT_PROMPT_PREFIX=" %{$fg[yellow]%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$reset_color%} ±"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_SUFFIX=""

ZSH_THEME_GIT_PROMPT_AHEAD=" ↑"
ZSH_THEME_GIT_PROMPT_BEHIND=" ↓"

ZSH_THEME_GIT_PROMPT_REMOTE_EXISTS=""
ZSH_THEME_GIT_PROMPT_REMOTE_MISSING=" ∅"
