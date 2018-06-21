# simpler-redux-show-state-change
This extension will display a source file at the line number associated with a specified redux state change when used in conjunction with [simpler-redux-state-monitor](https://github.com/AndrewBanks10/simpler-redux-state-monitor).

## Requirements

1. [vscode](https://code.visualstudio.com/)
2. [simpler-redux](https://github.com/AndrewBanks10/simpler-redux)
3. [StateMonitor](https://github.com/AndrewBanks10/simpler-redux-state-monitor)

## Installation

### Mac & Linux
```
cd $HOME/.vscode/extensions
git clone https://github.com/AndrewBanks10/simpler-redux-show-state-change
cd simpler-redux-show-state-change
npm install
```

### Windows
```
cd %USERPROFILE%\.vscode\extensions
git clone https://github.com/AndrewBanks10/simpler-redux-show-state-change
cd simpler-redux-show-state-change
npm install
```

## Usage
Using the StateMonitor, select a particular state for details. Then open the command palette in vscode and find the command "Simpler-redux show state change". Select it. This will open the source file that caused the state change at the particular line number. 

## Known Issues
None

### License
MIT

