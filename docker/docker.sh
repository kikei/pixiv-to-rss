#!/bin/bash
set -euo pipefail

IMAGE="pixiv2rss-aws"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPT_DIR="$ROOT_DIR/docker"
AWS_DIR="$SCRIPT_DIR/data/aws"
HOME_DIR="/home/worker"  # This is the home directory inside the container

remove_image() {
    if docker image inspect "$IMAGE" &>/dev/null; then
        docker rmi "$IMAGE"
    fi
}

ensure_image() {
    if ! docker image inspect "$IMAGE" &>/dev/null; then
        docker build -t "$IMAGE" "$SCRIPT_DIR"
    fi
}

check_aws_config() {
    if [ ! -f "$AWS_DIR/config" ] || [ ! -f "$AWS_DIR/credentials" ]; then
        echo "Please create:"
        echo "  $AWS_DIR/config"
        echo "  $AWS_DIR/credentials"
        exit 1
    fi
}

run_bash() {
    ensure_image
    check_aws_config

    docker run -it --rm \
        --entrypoint "bash" \
        --workdir "/work" \
        --user "$(id -u):$(id -g)" \
        --env "HOME=$HOME_DIR" \
        -v "$ROOT_DIR:/work" \
        -v "$AWS_DIR/config:$HOME_DIR/.aws/config:ro" \
        -v "$AWS_DIR/credentials:$HOME_DIR/.aws/credentials:ro" \
        "$IMAGE"
}

show_aws_identity() {
    ensure_image
    check_aws_config

    docker run -it --rm \
        -v "$AWS_DIR/config:/root/.aws/config:ro" \
        -v "$AWS_DIR/credentials:/root/.aws/credentials:ro" \
        "$IMAGE" \
        sts get-caller-identity
}

print_help() {
    cat <<EOF
Usage: $0 [-r] [-b] [-i] [-h]

Options:
    -r  Remove existing image
    -b  Run bash
    -i  Show AWS identity
    -h  Show this message
EOF
}

main() {
    local command=""
    while getopts "rbih" opt; do
        case "$opt" in
            r) command="remove_image" ;;
            b) command="run_bash" ;;
            i) command="show_aws_identity" ;;
            h) print_help ; exit 0 ;;
            *) print_help ; exit 1 ;;
        esac
    done

    if [ -z "$command" ]; then
        print_help
        exit 1
    fi

    "$command"
}

main "$@"
