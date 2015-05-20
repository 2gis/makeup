#!/bin/bash

STATUS=0
STASHABLE=$(git stash create)

if [ "$STASHABLE" ]; then
    git reset --hard -q
fi

gulp hooks.run
STATUS=$?

if [ "$STASHABLE" ]; then
    git stash apply $STASHABLE -q --index
fi

exit $STATUS
